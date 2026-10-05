// A live menu owns terminal input. Its background reads must never open a task.
export async function pollLiveMenu(ui,title,load,choices,{isCurrent=()=>true,intervalMs=5000,...options}={}) {
  const abort=new AbortController();
  let value=await ui.task('Loading AdRouter',signal=>load(signal)),stale=false,pending=false,stopped=false;
  const renderEntries=()=>choices(value,stale).map(entry=>{
    const live={...entry};
    for(const key of ['label','detail','details','disabled'])Object.defineProperty(live,key,{enumerable:true,get:()=>choices(value,stale).find(item=>item.value===entry.value)?.[key]??entry[key]});
    return live;
  });
  const entries=renderEntries();
  const poll=async()=>{
    if(pending||stopped||!isCurrent())return;
    pending=true;
    try {
      const next=await load(AbortSignal.any([abort.signal,AbortSignal.timeout(10000)]));
      if(stopped||!isCurrent())return;
      value=next;stale=false;
    }catch{if(stopped||!isCurrent())return;stale=true;}
    finally{
      pending=false;
      if(!stopped&&isCurrent()){entries.splice(0,entries.length,...renderEntries());ui.pending?.redraw?.();}
    }
  };
  const timer=setInterval(()=>void poll(),intervalMs);
  try{return await ui.menu(title,entries,{...options,explicitFilter:true,tick:true,lines:()=>[...(stale?['Status refresh failed: availability Unknown.']:[]),...(typeof options.lines==='function'?options.lines(value,stale):options.lines??[])]});}
  finally{stopped=true;clearInterval(timer);abort.abort();}
}
