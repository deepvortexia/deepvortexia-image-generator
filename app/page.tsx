"use client";
import React,{useState,useEffect,Suspense,useCallback}from'react';
import{useSearchParams}from'next/navigation';
import EcosystemCards from'../components/EcosystemCards';
import Header from'../components/Header';
import CompactSuggestions from'../components/CompactSuggestions';
import PromptSection from'../components/PromptSection';
import ImageDisplay from'../components/ImageDisplay';
import{useAuth}from'@/context/AuthContext';
import{createClient}from'@/lib/supabase/client';
function HomeContent(){
    const{refreshProfile}=useAuth();
    const supabase=createClient();
    const searchParams=useSearchParams();
    const[aspectRatio,setAspectRatio]=useState("1:1");
    const[userPrompt,setUserPrompt]=useState("");
    const[isGenerating,setIsGenerating]=useState(false);
    const[imageUrl,setImageUrl]=useState(null);
    const[imageId,setImageId]=useState(null);
    const[error,setError]=useState(null);
    const[buyPack,setBuyPack]=useState(null);
    const handleStyleSelect=(s)=>setUserPrompt(p=>(p+" "+s).trim());
    const handleIdeaSelect=(idea)=>setUserPrompt(idea);
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
        setIsGenerating(true);setError(null);setImageUrl(null);setImageId(null);
        try{
            const{data:{session:s}}=await supabase.auth.getSession();
            if(!s?.access_token){setError('Please sign in.');setIsGenerating(false);return;}
            const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+s.access_token},body:JSON.stringify({prompt:userPrompt,aspectRatio})});
            const data=await res.json();
            if(!res.ok)throw new Error(data.error||'Failed');
            setImageUrl(data.imageUrl);setImageId(data.imageId||null);
            await refreshProfile();
        }catch(err){setError(err.message);}
        finally{setIsGenerating(false);}
    };
    return React.createElement('div',{className:"min-h-screen bg-black text-white font-sans pb-10"},
                               React.createElement(Header,{buyPack,onBuyPackHandled:()=>setBuyPack(null)}),
                               React.createElement('main',{className:"max-w-[1200px] mx-auto px-3 sm:px-5 flex flex-col gap-4 sm:gap-8"},
                                                   React.createElement('div',{className:"flex flex-col gap-3 sm:gap-5 w-full max-w-[800px] mx-auto mt-3 sm:mt-5"},
                                                                       React.createElement(CompactSuggestions,{onStyleSelect:handleStyleSelect,onIdeaSelect:handleIdeaSelect}),
                                                                       React.createElement(PromptSection,{prompt:userPrompt,onPromptChange:setUserPrompt,aspectRatio,onAspectRatioChange:setAspectRatio,onGenerate:handleGenerate,isLoading:isGenerating})),
                                                   React.createElement(ImageDisplay,{imageUrl,isLoading:isGenerating,error,imageId,onRegenerate:handleGenerate}),
                                                   React.createElement(EcosystemCards,null)));
}
export default function Home(){
    return React.createElement(Suspense,{fallback:React.createElement('div',{className:"min-h-screen bg-black"})},React.createElement(HomeContent,null));
}
