const phases=['preparation','tunnel','tls','dispatch','headers','streaming','validation'];
const codes=['ENOTFOUND','EAI_AGAIN','ECONNRESET','ECONNREFUSED','EPIPE','ETIMEDOUT','CERT_HAS_EXPIRED','UNABLE_TO_VERIFY_LEAF_SIGNATURE','ERR_TLS_CERT_ALTNAME_INVALID','DEPTH_ZERO_SELF_SIGNED_CERT','ERR_SSL_WRONG_VERSION_NUMBER','ABORT_ERR','tunnel_rejected','tunnel_timeout'];
export function transportCode(error){for(let i=0,e=error;e&&i<4;i++,e=e.cause)if(codes.includes(e.code))return e.code;return null;}
export function requestEvidence(node,frame,now=Date.now){
  const started=now(),timeline=[];let phase='preparation',statusCode=null,code=null,category=null,dispatchEvidence='not_sent',responseEvidence='not_observed';
  const elapsed=()=>Math.max(0,Math.min(600000,now()-started));
  const stage=value=>{if(!phases.includes(value))return;phase=value;if(value==='tunnel')dispatchEvidence='outcome_unknown';if(value==='dispatch')dispatchEvidence='dispatched';if(value==='headers')responseEvidence='headers_received';if(value==='streaming')responseEvidence='streaming';if(timeline.at(-1)?.phase!==value&&timeline.length<16)timeline.push({phase:value,elapsedMs:elapsed()});};
  stage('preparation');
  return {stage,attempt:()=>{if(dispatchEvidence==='not_sent')dispatchEvidence='outcome_unknown';},response:status=>{statusCode??=status;if(responseEvidence==='not_observed')stage('headers');},error:error=>{const next=transportCode(error);if(!next)return;code??=next;category??=['ENOTFOUND','EAI_AGAIN'].includes(code)?'dns':/CERT|TLS|SSL|SELF_SIGNED/.test(code??'')?'tls':['ETIMEDOUT','tunnel_timeout'].includes(code)?'timeout':code?'connection':null;},
    snapshot:failure=>({schemaVersion:1,requestId:frame.requestId,sessionId:frame.sessionId??null,providerRunId:node.providerRunId??null,model:frame.model??null,api:frame.api??null,phase,code:failure,elapsedMs:elapsed(),statusCode,transportCategory:category,transportCode:code,dispatchEvidence,responseEvidence,timeline:timeline.slice()})};
}
