import { command, fail } from './identity.mjs';
import { baseline } from './baseline.mjs';
export function linkedDatabase(result) {
 const projects=Array.isArray(result)?result:result?.projects;
 if(!Array.isArray(projects))throw fail('hosted_database_metadata_invalid');
 const database=projects.find(p=>p.id==='aqyiwlanxdhkwwlwiias');if(!database?.linked||database.status!=='ACTIVE_HEALTHY')throw fail('hosted_database_target_mismatch');return database;
}
export async function hostedMetadata({pagesCli,databaseWorkdir,routerRoot,signal}) {
  const machine=JSON.parse(await command('flyctl',['status','--app','adrouter-staging','--json'],{signal}));
  const m=machine.Machines?.find(m=>m.id==='d8d2d26c057308');
  if(machine.Machines.length!==1||m?.image_ref?.digest!==baseline.flyDigest||m.image_ref.labels?.['org.opencontainers.image.revision']!==baseline.routerCommit)throw fail('hosted_fly_identity_mismatch');
  const projects=JSON.parse(await command(pagesCli,['pages','project','list','--json'],{signal}));
  const project=projects.find(p=>p['Project Name']==='adrouter-dashboard');
  if(project?.['Git Provider']!=='No'||!project['Project Domains'].includes('app-staging.adrouter.co'))throw fail('hosted_pages_metadata_mismatch');
  const deployments=JSON.parse(await command(pagesCli,['pages','deployment','list','--project-name','adrouter-dashboard','--json'],{signal}));
  const current=deployments.find(d=>d.Environment==='Production');
  if(current?.Id!==baseline.deployment||current.Source!==(baseline.pagesSourceCommit??baseline.routerCommit).slice(0,7))throw fail('hosted_pages_identity_mismatch');
  const projectsDb=JSON.parse(await command('supabase',['--workdir',databaseWorkdir,'projects','list','--output-format','json'],{signal}));
  linkedDatabase(projectsDb);
  const migrations=JSON.parse(await command('supabase',['--workdir',databaseWorkdir,'migration','list','--linked'],{signal}));
  if(!migrations.migrations?.some(m=>m.remote==='20261003025031'))throw fail('hosted_migration_missing');
  for(const [repo,commit] of [['adrouter/adrouter-new',baseline.baselineVerifierCommit],['HappyCool121/adrouter-dashboard',baseline.routerCommit]]){
    const r=JSON.parse(await command('gh',['api',`repos/${repo}`],{signal}));if(!r.permissions?.push)throw fail('github_push_access_missing');
    const branch=JSON.parse(await command('gh',['api',`repos/${repo}/branches/codex/adrv2-reliability-20261001`],{signal}));
    // Product source stays frozen; verified test-only branch commits may be ahead.
    if(repo.includes('dashboard')&&branch.commit.sha!==commit&&branch.commit.sha!==(await command('git',['-C',routerRoot,'rev-parse','HEAD'])).trim())throw fail('github_router_identity_mismatch');
  }
  const response=await fetch('https://api-staging.adrouter.co/health/ready',{redirect:'error',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(30000)]):AbortSignal.timeout(30000)});
  if(response.status!==200)throw fail('hosted_readiness_failed');
  return {checkedAt:new Date().toISOString(),flyMachine:'d8d2d26c057308',flyDigest:baseline.flyDigest,routerCommit:baseline.routerCommit,pagesDeployment:baseline.deployment,gitIntegration:'none',migration:'20261003025031',apiReady:true};
}
