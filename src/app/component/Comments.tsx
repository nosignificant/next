"use client";

import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <div className="mt-20 border-t border-neutral-100 pt-10">
      <Giscus
        id="comments"
        repo="nosignificant/next"          
        repoId="R_kgDOPqMfTQ"              
        category="General"                 
        categoryId="DIC_kwDOPqMfTc4C0Yeo" 
        mapping="pathname"                 
        strict="0"
        reactionsEnabled="1"               
        emitMetadata="0"
        inputPosition="bottom"
        theme="light"                      
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}