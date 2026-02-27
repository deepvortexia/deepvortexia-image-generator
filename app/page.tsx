"use client";
import React,{useState,useEffect,Suspense,useCallback}from'react';
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
  const[imageId,setImageId]=useState<string|null>(null);
  const[error,setError]=useState<string|null>(null);
  const[toast,setToast]=useState<{title:string;message:string;type:'success'|'error'|'warning'}|null>(null);
  const[buyPack,setBuyPack]=useState<string|null>(null);
  const handleStyleSelect=(s:string)=>setUserPrompt(p=>(p+" "+s).trim());
  const handleIdeaSelect=(idea:string)=>setUserPrompt(idea);
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
    setIsGenerating(true);setError(null);setToast(null);setImageUrl(null);setImageId(null);
    try{
      const{data:{session:s}}=await supabase.auth.getSession();
      if(!s?.access_token){setError('Please sign in.');setIsGenerating(false);return;}
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),60000);
      let res:Response;
      try{
        res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+s.access_token},body:JSON.stringify({prompt:userPrompt,aspectRatio}),signal:controller.signal});
      }catch(fetchErr:any){
        clearTimeout(timeout);
        if(fetchErr.name==='AbortError'){
          setToast({title:'Request Timed Out',message:'The generation took too long. Please try again. No credits were deducted.',type:'warning'});
        }else{
          setToast({title:'Network Error',message:'Could not connect to the server. Please check your connection and try again. No credits were deducted.',type:'error'});
        }
        return;
      }
      clearTimeout(timeout);
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
      const data=await res.json();
      setImageUrl(data.imageUrl);setImageId(data.imageId||null);
      await refreshProfile();
    }catch(err:unknown){
      setToast({title:'Generation Failed',message:(err instanceof Error?err.message:'An unexpected error occurred')+'. No credits were deducted.',type:'error'});
    }finally{setIsGenerating(false);}
  };
  return(
    <div className="min-h-screen bg-black text-white font-sans pb-10">
      <Header buyPack={buyPack} onBuyPackHandled={()=>setBuyPack(null)}/>
      <main className="max-w-[1200px] mx-auto px-3 sm:px-5 flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col gap-3 sm:gap-5 w-full max-w-[800px] mx-auto mt-3 sm:mt-5">
          <CompactSuggestions onStyleSelect={handleStyleSelect} onIdeaSelect={handleIdeaSelect}/>
          <PromptSection prompt={userPrompt} onPromptChange={setUserPrompt} aspectRatio={aspectRatio} onAspectRatioChange={setAspectRatio} onGenerate={handleGenerate} isLoading={isGenerating}/>
        </div>
        <ImageDisplay imageUrl={imageUrl} isLoading={isGenerating} error={error} imageId={imageId} onRegenerate={handleGenerate}/>
        <EcosystemCards/>
      </main>
      <Notification show={!!toast} onClose={()=>setToast(null)} title={toast?.title} message={toast?.message} type={toast?.type}/>
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
