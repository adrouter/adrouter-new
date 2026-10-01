import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AuthStorage, ModelRegistry, SettingsManager, SessionManager, createAgentSessionServices, createAgentSessionFromServices, createAgentSessionRuntime, InteractiveMode, runPrintMode, runRpcMode, parseArgs } from '@adrouter/cli';
import { marketplaceStream } from './coding-provider.mjs';
import { bridge, bindChild, authorize, config } from './coding-controls.mjs';

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
  const result=await createAgentSessionFromServices({services,sessionManager,sessionStartEvent,model,thinkingLevel:config.thinking?'medium':'off',scopedModels:[{model}],tools:args.tools??['read','bash','edit','write','grep','find','ls']});
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
  else await new InteractiveMode(runtime,{initialMessage:config.prompt,initialMessages:args.messages}).run();
} finally {clearTimeout(deadline);await runtime.dispose();if(child)await bridge('/child/finish',{}).catch(()=>{});}
