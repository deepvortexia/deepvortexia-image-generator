"use client";
import React,{useState,useEffect,Suspense,useCallback,useRef}from'react';
import{useSearchParams}from'next/navigation';
import EcosystemCards from'../components/EcosystemCards';
import Header from'../components/Header';
import CompactSuggestions from'../components/CompactSuggestions';
import PromptSection from'../components/PromptSection';
import ImageDisplay from'../components/ImageDisplay';
import{Notification}from'../components/Notification';
import{useAuth}from'@/context/AuthContext';
import{createClient}from'@/lib/supabase/client';
function HomeContent(){
  const{refreshProfile}=useAuth();
  const supabase=createClient();
  const searchParams=useSearchParams();
  const[aspectRatio,setAspectRatio]=useState("1:1");
  const[userPrompt,setUserPrompt]=useState("");
  const[isGenerating,setIsGenerating]=useState(false);
  const[imageUrl,setImageUrl]=useState<string|null>(null);
  const[error,setError]=useState<string|null>(null);
  const[toast,setToast]=useState<{title:string;message:string;type:'success'|'error'|'warning'}|null>(null);
  const[buyPack,setBuyPack]=useState<string|null>(null);
  const[loadingStage,setLoadingStage]=useState<0|1|2|3>(0);
  const[loadingProgress,setLoadingProgress]=useState(0);
  const[elapsedSeconds,setElapsedSeconds]=useState(0);
  const progressIntervalRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const elapsedIntervalRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const textareaRef=useRef<HTMLTextAreaElement>(null);
  const focusTextarea=()=>setTimeout(()=>textareaRef.current?.focus(),0);
  const handleStyleSelect=(s:string)=>{setUserPrompt(s);focusTextarea();};
  const handleIdeaSelect=(idea:string)=>{setUserPrompt(idea);focusTextarea();};
  const refreshWithRetry=useCallback(async()=>{
    await refreshProfile();
    setTimeout(async()=>{await refreshProfile();},2000);
    setTimeout(async()=>{await refreshProfile();},5000);
  },[refreshProfile]);
  useEffect(()=>{
    if(!searchParams)return;
    const success=searchParams.get('success');
    const buy=searchParams.get('buy');
    if(success==='true'){refreshWithRetry();window.history.replaceState({},'','/');}
    if(buy){
      const v=['Starter','Basic','Popular','Pro','Ultimate'];
      if(v.includes(buy)){setBuyPack(buy);window.history.replaceState({},'','/');}
    }
  },[searchParams,refreshWithRetry]);
  const handleGenerate=async()=>{
    if(!userPrompt.trim())return;
    const clearIntervals=()=>{
      if(progressIntervalRef.current){clearInterval(progressIntervalRef.current);progressIntervalRef.current=null;}
      if(elapsedIntervalRef.current){clearInterval(elapsedIntervalRef.current);elapsedIntervalRef.current=null;}
    };
    setIsGenerating(true);setError(null);setToast(null);setImageUrl(null);
    setLoadingStage(1);setLoadingProgress(0);setElapsedSeconds(0);
    elapsedIntervalRef.current=setInterval(()=>setElapsedSeconds(s=>s+1),1000);
    try{
      setLoadingProgress(5);
      const{data:{session:s}}=await supabase.auth.getSession();
      if(!s?.access_token){setError('Please sign in.');setIsGenerating(false);return;}
      setLoadingProgress(10);setLoadingStage(2);
      progressIntervalRef.current=setInterval(()=>{
        setLoadingProgress(prev=>{const gap=85-prev;return gap<0.05?prev:prev+gap*0.003;});
      },100);
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),60000);
      let res:Response;
      try{
        res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+s.access_token},body:JSON.stringify({prompt:userPrompt,aspectRatio}),signal:controller.signal});
      }catch(fetchErr:any){
        clearTimeout(timeout);clearIntervals();
        if(fetchErr.name==='AbortError'){
          setToast({title:'Request Timed Out',message:'The generation took too long. Please try again. No credits were deducted.',type:'warning'});
        }else{
          setToast({title:'Network Error',message:'Could not connect to the server. Please check your connection and try again. No credits were deducted.',type:'error'});
        }
        return;
      }
      clearTimeout(timeout);
      if(progressIntervalRef.current){clearInterval(progressIntervalRef.current);progressIntervalRef.current=null;}
      if(!res.ok){
        const data=await res.json().catch(()=>({}));
        switch(res.status){
          case 401:setToast({title:'Session Expired',message:'Your session has expired. Please refresh the page and sign in again. No credits were deducted.',type:'error'});break;
          case 402:setToast({title:'Insufficient Credits',message:'You don\'t have enough credits. Purchase more to continue generating.',type:'warning'});setBuyPack('Starter');break;
          case 429:setToast({title:'Too Many Requests',message:'Please wait a moment before generating again. No credits were deducted.',type:'warning'});break;
          case 503:setToast({title:'Service Unavailable',message:'The image generation service is temporarily unavailable. Please try again in a few minutes. No credits were deducted.',type:'error'});break;
          default:setToast({title:'Generation Failed',message:(data.error||'An unexpected error occurred')+'. No credits were deducted.',type:'error'});break;
        }
        return;
      }
      setLoadingStage(3);setLoadingProgress(85);
      await new Promise<void>(resolve=>{
        let p=85;
        const finalize=setInterval(()=>{p+=3;setLoadingProgress(Math.min(p,100));if(p>=100){clearInterval(finalize);resolve();}},40);
      });
      const data=await res.json();
      setImageUrl(data.imageUrl);
      await refreshProfile();
      if(window.parent!==window){window.parent.postMessage({type:'deepvortex-credits-updated'},'https://deepvortexai.com');}
    }catch(err:unknown){
      setToast({title:'Generation Failed',message:(err instanceof Error?err.message:'An unexpected error occurred')+'. No credits were deducted.',type:'error'});
    }finally{clearIntervals();setIsGenerating(false);setLoadingStage(0);setLoadingProgress(0);}
  };
  return(
    <div className="app min-h-screen bg-black text-white font-sans pb-10">
      <Header buyPack={buyPack} onBuyPackHandled={()=>setBuyPack(null)}/>
      <div className="particles">
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((left, i) => (
          <div key={i} className="particle" style={{ left: `${left}%`, animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>
      <main className="max-w-[1200px] mx-auto px-3 sm:px-5 flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col gap-3 sm:gap-5 w-full max-w-[800px] mx-auto mt-3 sm:mt-5">
          <CompactSuggestions onStyleSelect={handleStyleSelect} onIdeaSelect={handleIdeaSelect}/>
          <PromptSection prompt={userPrompt} onPromptChange={setUserPrompt} aspectRatio={aspectRatio} onAspectRatioChange={setAspectRatio} onGenerate={handleGenerate} isLoading={isGenerating} textareaRef={textareaRef}/>
        </div>
        {isGenerating&&(
          <div className="loading-section">
            <div className="progress-stages">
              <div className={`progress-stage${loadingStage===1?' stage-active':loadingStage>1?' stage-done':''}`}>
                <div className="stage-dot"/>
                <span>Uploading image...</span>
              </div>
              <div className={`progress-stage${loadingStage===2?' stage-active':loadingStage>2?' stage-done':''}`}>
                <div className="stage-dot"/>
                <span>AI is animating your image...</span>
              </div>
              <div className={`progress-stage${loadingStage===3?' stage-active':''}`}>
                <div className="stage-dot"/>
                <span>Finalizing video...</span>
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{width:`${loadingProgress}%`}}/>
              </div>
              {loadingProgress>0&&(
                <div className="progress-bar-tip" style={{left:`${loadingProgress}%`}}/>
              )}
            </div>
            <div className="progress-footer">
              <span className="progress-percent">{Math.round(loadingProgress)}%</span>
              <span className="progress-elapsed">{elapsedSeconds}s...</span>
            </div>
          </div>
        )}
        <ImageDisplay imageUrl={imageUrl} isLoading={isGenerating} error={error} prompt={userPrompt} onRegenerate={handleGenerate}/>
        <EcosystemCards/>
      </main>
      <footer className="text-center py-14 mt-8 border-t border-[rgba(212,175,55,0.2)]">
        <a href="https://deepvortexai.com" className="block text-gray-400 hover:text-[#D4AF37] no-underline text-lg mb-6 transition-colors">Deep Vortex AI - Building the complete AI creative ecosystem</a>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <a href="https://www.tiktok.com/@deepvortexai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#D4AF37] no-underline text-base hover:opacity-75 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
            </svg>
            TikTok
          </a>
          <a href="https://x.com/deepvortexart" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#D4AF37] no-underline text-base hover:opacity-75 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </a>
          <a href="https://deepvortexai.quora.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#D4AF37] no-underline text-base hover:opacity-75 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12.071 0C5.4 0 0 5.4 0 12.071c0 6.67 5.4 12.071 12.071 12.071 6.67 0 12.071-5.4 12.071-12.071C24.142 5.4 18.742 0 12.07 0zm2.028 18.383c-.5-.998-.954-1.88-1.907-1.88h-.213l1.193-2.647h-.002c-.362.12-.743.18-1.128.18-2.287 0-3.996-1.837-3.996-4.177s1.709-4.177 3.997-4.177 3.996 1.837 3.996 4.177c0 1.29-.496 2.432-1.32 3.29.277.397.533.812.793 1.227l.15.238c.278.442.55.886.832 1.33l-2.395 2.44zm-2.057-4.997c1.18 0 1.94-1.083 1.94-2.51 0-1.428-.76-2.511-1.94-2.511s-1.94 1.083-1.94 2.51c0 1.428.76 2.511 1.94 2.511z"/>
            </svg>
            Quora
          </a>
          <a href="mailto:admin@deepvortexai.com" className="inline-block px-6 py-2.5 border border-[rgba(212,175,55,0.6)] rounded-lg bg-transparent text-[#D4AF37] no-underline text-base hover:bg-[rgba(212,175,55,0.1)] hover:border-[#D4AF37] transition-all">Contact Us</a>
        </div>
      </footer>
      <Notification show={!!toast} onClose={()=>setToast(null)} title={toast?.title} message={toast?.message} type={toast?.type}/>
      <a href="https://deepvortexai.com/game" target="_blank" rel="noopener noreferrer" className="play-earn-fab">⚡ Play &amp; Earn</a>
    </div>
  );
}
export default function Home(){
  return(
    <Suspense fallback={<div className="min-h-screen bg-black"/>}>
      <HomeContent/>
    </Suspense>
  );
}
