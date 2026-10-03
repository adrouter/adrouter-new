#!/usr/bin/env node
import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { resolve, join, dirname, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { baseline,configureBaseline } from './acceptance/baseline.mjs';
import { newReport, checkpoint, verifyEvidence, verdicts, safeCode, evidenceReference, digest, preparationGates, authGates, liveGates, validateSyntheticResult } from './acceptance/report.mjs';
import { command, execute, fail, verifyArtifact, verifyRuntime, verifierIdentity, verifyRouter } from './acceptance/identity.mjs';
import { hostedMetadata } from './acceptance/hosted-metadata.mjs';
import { hostedAuth,authExpectationHash } from './acceptance/hosted-auth.mjs';
import {catalogMatrix,matrixCaseIds} from '../test/helpers/pi-matrix.mjs';
import { prepareLiveFixture, liveAcceptance } from './acceptance/live.mjs';
export function parseAcceptanceArgs(args) {
 const options={phase:'prepare'},seen=new Set();
 const values=['phase','client-root','router-root','runtime-paths','tarball','evidence','pages-cli','database-workdir','reuse-baseline','prior-report','auth-config','run-config','artifact-manifest'];
 for(let i=0;i<args.length;i++){
  const key=args[i]?.replace(/^--/,'');
  if(seen.has(key))throw fail('acceptance_arguments_invalid');seen.add(key);
  if(args[i]==='--recover-broken'){options.recoverBroken=true;continue;}
  if(args[i]==='--help')return {help:true};
  if(!args[i]?.startsWith('--')||!values.includes(key)||!args[i+1]||args[i+1].startsWith('--')||options[key]&&key!=='phase')throw fail('acceptance_arguments_invalid');
  options[key]=args[++i];
 }
 if(!['prepare','hosted-auth','live'].includes(options.phase))throw fail('phase_invalid');
 for(const key of ['client-root','router-root','runtime-paths','tarball','evidence','pages-cli','database-workdir'])if(!isAbsolute(options[key]??''))throw fail('absolute_acceptance_paths_required');
 if(options.recoverBroken&&options.phase!=='hosted-auth')throw fail('recovery_phase_required');
 if(options.phase!=='prepare'&&(!options['prior-report']||!options['auth-config']))throw fail('prior_preparation_and_auth_config_required');
 if(options.phase==='live'&&!options['run-config'])throw fail('live_run_bounds_required');
 for(const key of ['prior-report','auth-config','run-config','reuse-baseline','artifact-manifest'])if(options[key]&&!isAbsolute(options[key]))throw fail('absolute_acceptance_paths_required');
 return options;
}
const sourceRoot=fileURLToPath(new URL('../',import.meta.url));
export async function runAcceptance(o) {
 if(o['artifact-manifest'])configureBaseline(JSON.parse(await readFile(o['artifact-manifest'],'utf8')));
 if(o['artifact-manifest']&&o['reuse-baseline'])throw fail('changed_artifact_cannot_reuse_baseline');
 const directory=o.evidence;await mkdir(dirname(directory),{recursive:true,mode:0o700});try{await mkdir(directory,{mode:0o700});}catch(error){throw fail(error.code==='EEXIST'?'evidence_directory_exists':'evidence_directory_unavailable');} // EEXIST refuses reused evidence.
 const verifier=await verifierIdentity(sourceRoot),routerVerifier=await verifyRouter(o['router-root']),identities={productCommit:baseline.productCommit,baselineVerifierCommit:baseline.baselineVerifierCommit,...verifier,...routerVerifier,routerCommit:baseline.routerCommit,version:baseline.version,artifactSha256:baseline.artifactSha256,deployment:baseline.deployment,runtimeSha256:'unverified',librarySha256:'unverified',providerRuntimeSha256:'unverified',codingRuntimeSha256:'unverified',catalogSha256:'unverified',authExpectationsSha256:'unverified'};
 const report=newReport(o.phase,identities),abort=new AbortController();let active=null,terminal,authConfig;
 const interrupt=()=>{report.interrupted=true;abort.abort();};process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
 const progress=text=>console.error(text??'Waiting for normal hosted expiry; completed gates are checkpointed.');
 const record=async(id,payload,status='passed')=>{
  const gate=report.gates.find(g=>g.id===id);if(!gate||gate.status==='passed')throw fail('gate_duplicate');
  const path=id+'.json',bytes=JSON.stringify(payload,null,2)+'\n';await writeFile(join(directory,path),bytes,{mode:0o600});
  Object.assign(gate,{status,observedAt:new Date().toISOString(),code:status==='failed'?'synthetic_cases_failed':null,evidence:[evidenceReference(path,digest(bytes))]});await checkpoint(directory,report);
 };
 const gate=async(id,fn)=>{active=id;progress(`Checking ${id}.`);const result=await fn();await record(id,result,result?.status==='failed'?'failed':'passed');if(result?.status==='failed')throw fail('synthetic_cases_failed');active=null;};
 const context={clientRoot:o['client-root'],sourceRoot,runtimePaths:o['runtime-paths'],tarball:o.tarball,routerRoot:o['router-root'],pagesCli:o['pages-cli'],databaseWorkdir:o['database-workdir'],signal:abort.signal};
 try{
  await checkpoint(directory,report);
  await gate('artifact',()=>verifyArtifact(context));await gate('runtime',async()=>{const result=await verifyRuntime(context);Object.assign(report.identities,result);await command(process.execPath,['scripts/verify-coding-provenance.mjs',context.clientRoot],{cwd:sourceRoot,signal:abort.signal});return result;});
  await verifyRouter(context.routerRoot);await gate('hosted-metadata',()=>hostedMetadata(context));
  if(o.phase!=='prepare'){
   authConfig=JSON.parse(await readFile(o['auth-config'],'utf8'));report.identities.authExpectationsSha256=authExpectationHash(authConfig);
   const priorPath=o['prior-report'],prior=await verifyEvidence(dirname(priorPath),JSON.parse(await readFile(priorPath,'utf8')));
   if(!prior.finishedAt||prior.interrupted||prior.errorCode)throw fail('prior_run_incomplete');
   if(Object.keys(report.identities).filter(k=>k!=='authExpectationsSha256').some(k=>prior.identities[k]!==report.identities[k]))throw fail('prior_identity_mismatch');
   if(o.phase==='live'&&prior.identities.authExpectationsSha256!==report.identities.authExpectationsSha256)throw fail('prior_hosted_installations_mismatch');
   const required=o.phase==='live'?[...preparationGates,...authGates]:preparationGates;
   if(required.some(id=>prior.gates.find(g=>g.id===id)?.status!=='passed'))throw fail('prior_gates_incomplete');
   for(const id of required.filter(id=>!['artifact','runtime','hosted-metadata'].includes(id))){
    const old=prior.gates.find(g=>g.id===id);for(const ref of old.evidence){await mkdir(dirname(join(directory,ref.path)),{recursive:true,mode:0o700});await cp(join(dirname(priorPath),ref.path),join(directory,ref.path),{force:false,errorOnExist:true});}Object.assign(report.gates.find(g=>g.id===id),old);
   }
   await checkpoint(directory,report);
  }
  const env={...process.env,ADR_ACCEPTANCE_CLIENT_ROOT:context.clientRoot,ADR_ACCEPTANCE_ROUTER_ROOT:context.routerRoot,ADR_ACCEPTANCE_RUNTIME_PATHS:context.runtimePaths};
  const {piCatalog:installedCatalog}=await import(pathToFileURL(join(context.clientRoot,'src/generated/pi-catalog.mjs')).href);const expectedMatrix=catalogMatrix(installedCatalog);
  const synthetic=async script=>{let output;try{output=(await execute(process.execPath,[script],{cwd:sourceRoot,env,signal:abort.signal,timeout:360000,maxBuffer:8*1024*1024,encoding:'utf8'})).stdout;}catch(error){if(abort.signal.aborted)throw fail('interrupted');output=error.stdout;}if(!output)throw fail('synthetic_result_missing');const result=JSON.parse(output);delete result.installed;validateSyntheticResult(result,matrixCaseIds(expectedMatrix));if(result.providerApiPairs!==new Set(expectedMatrix.map(c=>c.provider+'/'+c.api)).size||result.nativeFamilies!==new Set(expectedMatrix.map(c=>c.api)).size)throw fail('synthetic_catalog_mismatch');return result;};
  if(o.phase==='prepare'){
   await gate('catalog-source',()=>synthetic('scripts/verify-pi-source.mjs'));
   await gate('catalog-guest',()=>synthetic('scripts/verify-pi-guest.mjs'));
   await gate('router-regressions',async()=>{
    await command('npm',['run','test:marketplace'],{cwd:join(context.routerRoot,'backend'),signal:abort.signal,timeout:180000});
    await command('npm',['run','test:production-auth'],{cwd:join(context.routerRoot,'backend'),signal:abort.signal,timeout:180000});await command(process.execPath,['scripts/verify-credential-volume.mjs'],{cwd:sourceRoot,env,signal:abort.signal,timeout:300000});return {nativeRegressions:true,realDisposablePostgres:true,productionApplication:true,installedCredentialVolume:true,hostedProfiles:false};
   });
   if(o['reuse-baseline']){
    const validation=JSON.parse(await readFile(join(o['reuse-baseline'],'validation.json'),'utf8')),artifact=JSON.parse(await readFile(join(o['reuse-baseline'],'artifact.json'),'utf8'));
    if(artifact.sourceCommit!==baseline.productCommit||artifact.sha256!==baseline.artifactSha256||validation.client?.source!==baseline.productCommit||validation.client?.supplementalVerifierCI?.source!==baseline.baselineVerifierCommit||validation.router?.source!==baseline.routerCommit)throw fail('reuse_baseline_identity_mismatch');
    // No changed helper or packaged runtime can borrow the earlier actual-VM gates.
    for(const file of ['scripts/verify-coding-mac.mjs','scripts/verify-coding-pty.py','scripts/verify-provider-lifecycle.py','scripts/verify-provider-console.mjs','scripts/verify-provider-console.py']){
     let committed;try{committed=await command('git',['-C',sourceRoot,'show',baseline.baselineVerifierCommit+':'+file]);}catch{throw fail('reuse_verifier_missing');}
     if(digest(committed)!==digest(await readFile(join(sourceRoot,file))))throw fail('reuse_verifier_changed');
    }
    const routerHelper='backend/scripts/verify-marketplace-provider-lifecycle-mac.ts';if(digest(await command('git',['-C',context.routerRoot,'show',baseline.routerCommit+':'+routerHelper]))!==digest(await readFile(join(context.routerRoot,routerHelper))))throw fail('reuse_router_verifier_changed');
    const mac=validation.installedMac;
    if(mac?.buyerCodingPty?.status!=='passed'||!mac.buyerCodingPty.terminalRestored)throw fail('coding_reuse_invalid');
    const life=mac.providerLifecycle660Seconds;if(life?.status!=='passed'||life.idleSeconds<660||!['sameVmReconnect','savedContextResume','explicitStop','cancellationUnknownUsageRetained','guestTeardown','terminalRestored'].every(k=>life[k]===true))throw fail('lifecycle_reuse_invalid');
    await gate('coding',async()=>({reused:true,baselineEvidenceSha256:digest(await readFile(join(o['reuse-baseline'],'validation.json'))),terminalRestored:true,elapsedSeconds:mac.buyerCodingPty.elapsedSeconds}));
    await gate('lifecycle',async()=>({reused:true,baselineEvidenceSha256:digest(await readFile(join(o['reuse-baseline'],'validation.json'))),idleSeconds:660,sameVmReconnect:true,savedContextResume:true,unknownLiabilityPreserved:true,guestTeardown:true,terminalRestored:true}));
   }else{
    await gate('coding',async()=>{await command('python3',['scripts/verify-coding-pty.py','--long'],{cwd:sourceRoot,env:{...env,ADR_NATIVE_PI_BUYER:'1'},signal:abort.signal,timeout:900000});return {actualInstalledMacPty:true,syntheticInference:true};});
    await gate('lifecycle',async()=>{await command('python3',['scripts/verify-provider-lifecycle.py'],{cwd:sourceRoot,env:{...env,ADR_PROVIDER_LIFECYCLE_QUICK:'0'},signal:abort.signal,timeout:1100000});return {actualInstalledMacPty:true,idleSeconds:660,syntheticInference:true};});
   }
   await gate('guest-console',async()=>{await command('python3',['scripts/verify-provider-console.py'],{cwd:sourceRoot,env:{...env,ADR_NATIVE_PI_ACCEPTANCE:'2'},signal:abort.signal,timeout:240000});return {hiddenSyntheticKey:true,returnToHost:true,guestTeardown:true,terminalRestoration:true};});
   const {piCatalog}=await import(pathToFileURL(join(context.clientRoot,'src/generated/pi-catalog.mjs')).href);await prepareLiveFixture(directory,piCatalog);
  }else{
   if(!process.stdin.isTTY||!process.stdout.isTTY)throw fail('operator_terminal_required');
   terminal=createInterface({input:process.stdin,output:process.stdout});
   const prompt=question=>terminal.question(question,{signal:abort.signal});
   const confirm=async question=>(await prompt(question+' [yes/no] ')).trim()==='yes';
   const approval=async event=>{if(event.status!=='approval_required')return;console.error(`Approve one ${o.phase} installation with the original account in native Safari. Comparison code: ${event.comparisonCode}`);await command('/usr/bin/open',['-a','Safari',event.verificationUrl],{signal:abort.signal});};
   // Network's notify callback is synchronous; serialize Safari opening and catch
   // failures without leaking approval URLs into persisted evidence.
   let pendingApproval=Promise.resolve();const notify=event=>{pendingApproval=pendingApproval.then(()=>approval(event));pendingApproval.catch(()=>abort.abort());};
   if(o.phase==='hosted-auth'){active='hosted-auth';await hostedAuth({...context,config:authConfig,record,confirm,approval:notify,recoverBroken:o.recoverBroken,progress});await pendingApproval;active=null;}
   else{if(verdicts(report).readiness!=='ready')throw fail('live_readiness_incomplete');active='live';await liveAcceptance({...context,authConfig,run:JSON.parse(await readFile(o['run-config'],'utf8')),record,confirm,prompt,progress});active=null;}
  }
  const finalVerifier=await verifierIdentity(sourceRoot),finalRouterVerifier=await verifyRouter(context.routerRoot);if(finalVerifier.verifierTreeSha256!==report.identities.verifierTreeSha256||finalVerifier.verifierCommit!==report.identities.verifierCommit||JSON.stringify(finalRouterVerifier)!==JSON.stringify(routerVerifier))throw fail('verifier_changed_during_run');
 }catch(error){
  const current=report.gates.find(g=>g.id===active&&g.status!=='passed');if(current&&!report.interrupted)Object.assign(current,{status:'failed',observedAt:new Date().toISOString(),code:safeCode(error)});
  report.errorCode=safeCode(error);report.interrupted ||= abort.signal.aborted;report.finishedAt=new Date().toISOString();await checkpoint(directory,report);throw fail(safeCode(error));
 }finally{terminal?.close();process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);}
 report.finishedAt=new Date().toISOString();await checkpoint(directory,report);return report;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const options=parseAcceptanceArgs(process.argv.slice(2));if(options.help)console.log('acceptance-runner.mjs --phase prepare|hosted-auth|live --client-root ABS --router-root ABS --runtime-paths ABS --tarball ABS --evidence FRESH_ABS --pages-cli ABS --database-workdir ABS [--artifact-manifest ABS] [--reuse-baseline ABS] [--prior-report ABS --auth-config ABS] [--recover-broken] [--run-config ABS]');else{const report=await runAcceptance(options);console.log(JSON.stringify({report:join(options.evidence,'report.json'),phase:report.phase,verdicts:report.verdicts}));const required=report.phase==='prepare'?preparationGates:report.phase==='hosted-auth'?[...preparationGates,...authGates]:[...preparationGates,...authGates,...liveGates];if(required.some(id=>report.gates.find(g=>g.id===id).status!=='passed'))process.exitCode=2;}}
 catch(error){console.error(JSON.stringify({status:'incomplete',code:safeCode(error)}));process.exitCode=1;}
}
