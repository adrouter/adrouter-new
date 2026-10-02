import { codingFooter } from '../coding-display.mjs';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AuthStorage, ModelRegistry, SettingsManager, SessionManager, createAgentSessionServices, createAgentSessionFromServices, createAgentSessionRuntime, InteractiveMode, runPrintMode, runRpcMode, parseArgs } from '@adrouter/cli';
import { marketplaceStream } from './coding-provider.mjs';
import { bridge, bindChild, authorize, config } from './coding-controls.mjs';

for(const [key,value] of Object.entries(config.terminal??{}))if(['TERM','COLORTERM','TERM_PROGRAM','TERM_PROGRAM_VERSION'].includes(key)&&/^[a-zA-Z0-9_.-]{1,80}$/.test(value))process.env[key]=value;
if(config.monochrome)process.env.NO_COLOR='1';
process.env.HOME='/tmp';process.env.ADROUTER_CODING_AGENT_DIR='/tmp/adr-agent';process.env.npm_config_userconfig='/tmp/.npmrc';
const argv=process.argv.slice(2), child=argv[0]==='--child';if(child)argv.shift();
const args=parseArgs(argv); if(child){const grant=await bindChild(args.mode==='rpc'?'btw':'subagent',!(args.tools??[]).every(n=>['read','grep','find','ls'].includes(n)));config.purpose=grant.purpose;}
const cwd='/workspace',agentDir='/tmp/adr-agent';await mkdir(agentDir,{recursive:true,mode:0o700});
const authStorage=AuthStorage.inMemory();
const modelRegistry=ModelRegistry.inMemory(authStorage);
modelRegistry.registerProvider('marketplace',{baseUrl:'http://session.invalid',apiKey:'narrow-session-capability',api:'adr-marketplace',streamSimple:marketplaceStream,models:[{id:config.model,name:config.model,reasoning:!!config.thinking,input:['text'],cost:{input:0,output:0,cacheRead:0,cacheWrite:0},contextWindow:config.contextWindowTokens,maxTokens:config.maxOutputTokens}]});
const model=modelRegistry.find('marketplace',config.model);
const settingsManager=SettingsManager.create(cwd,agentDir,{projectTrusted:!!config.trusted});
settingsManager.setRetryEnabled(false);
const factory=async({sessionManager,sessionStartEvent,cwd:targetCwd})=>{
  if(targetCwd!==cwd)throw Error('workspace_switch_requires_new_import');
  const services=await createAgentSessionServices({cwd,agentDir,authStorage,modelRegistry,settingsManager,resourceLoaderOptions:{includeBundledFeatures:!child,noExtensions:child || args.noExtensions,noSkills:args.noSkills,noPromptTemplates:args.noPromptTemplates,systemPrompt:args.systemPrompt}});
  const result=await createAgentSessionFromServices({services,sessionManager,sessionStartEvent,model,thinkingLevel:config.thinking?(settingsManager.getDefaultThinkingLevel()??'off'):'off',scopedModels:[{model}],tools:args.tools??['read','bash','edit','write','grep','find','ls']});
  await result.session.bindExtensions({authorizeToolCall:authorize});
  return {...result,services,diagnostics:services.diagnostics};
};
const manager=args.session?SessionManager.open(args.session,join(agentDir,'sessions'),cwd):config.resume?SessionManager.continueRecent(cwd,join(agentDir,'sessions')):SessionManager.create(cwd,join(agentDir,'sessions'));
const runtime=await createAgentSessionRuntime(factory,{cwd,agentDir,sessionManager:manager});
await writeFile('/tmp/adr-coding-ready','ready',{mode:0o600});
const deadline=setTimeout(()=>{void runtime.dispose().finally(()=>process.exit(124));},Math.max(1,config.expiresAt-Date.now()));
try {
  if(args.mode==='rpc')await runRpcMode(runtime);
  else if(args.print||args.mode==='json')process.exitCode=await runPrintMode(runtime,{mode:args.mode==='json'?'json':'text',initialMessage:config.prompt,messages:args.messages,authorizeToolCall:authorize});
  else {const mode=new InteractiveMode(runtime,{initialMessage:config.prompt,initialMessages:args.messages});await mode.init();let terminalSuspended=false,terminalPolling=false;const agentId=randomUUID();
    const suspend=()=>{if(terminalSuspended)return;terminalSuspended=true;globalThis.__adrCodingSuspending=true;mode.ui.stop();globalThis.__adrCodingSuspending=false;};
    const resume=()=>{if(!terminalSuspended)return;terminalSuspended=false;mode.ui.start();mode.ui.invalidate();};
    globalThis.__adrCodingWorkspace=async()=>{await new Promise(resolve=>setImmediate(resolve));const until=Date.now()+3000;while(runtime.session?.isStreaming&&Date.now()<until)await new Promise(resolve=>setTimeout(resolve,50));if(runtime.session?.isStreaming){mode.showWarning('Wait for the current response before opening the workspace.');return;}suspend();try{await bridge('/terminal/workspace',{});}catch(e){resume();mode.ui.requestRender(true);throw e;}};
    const pollTerminal=async()=>{if(terminalPolling)return;terminalPolling=true;try{const command=await bridge('/terminal/poll',{});if(command.id){if(command.operation==='suspend')suspend();else if(command.operation==='resume')resume();else throw Error('terminal_command_rejected');await bridge('/terminal/ack',{id:command.id,agentId,draftHash:createHash('sha256').update(mode.editor.getText()).digest('hex')});if(command.operation==='resume')mode.ui.requestRender(true);}}catch{}finally{terminalPolling=false;}};
    const terminalTimer=setInterval(()=>void pollTerminal(),50);let polling=false;const update=async()=>{if(polling)return;polling=true;try{globalThis.__adrCodingFooter=codingFooter;globalThis.__adrThinkingExplanation=config.thinkingExplanation;globalThis.__adrCodingDisplay=await bridge('/display',{});if(!terminalSuspended)mode.ui.requestRender();}catch{}finally{polling=false;}};await update();const timer=setInterval(()=>void update(),1500);try{await mode.run();}finally{clearInterval(timer);clearInterval(terminalTimer);delete globalThis.__adrCodingWorkspace;}}
} finally {clearTimeout(deadline);await runtime.dispose();if(child)await bridge('/child/finish',{}).catch(()=>{});}
