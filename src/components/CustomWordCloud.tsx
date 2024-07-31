"use client";
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react'
import D3WordCloud from "react-d3-cloud";

type Props = {
  formattedTopics:{text:string,value:number}[]
}



const fontSizeWrapper=(word:{value:number})=>{
    return Math.log2(word.value)*5 +16
}



const CustomWordCloud = ({formattedTopics}: Props) => {
    const theme=useTheme();
    const router=useRouter();
  return (
    <>
      <D3WordCloud
      height={550}
      data={formattedTopics}
      font={"Times"}
      fontSize={fontSizeWrapper}
      rotate={0}
      padding={10}
      onWordClick={(event:any,word:any)=>{
        router.push(`/quiz?topic=${word.text}`)
      }}
      fill={theme.theme =="dark"?"white":"black"}

      />  
    </>
  )
}

export default CustomWordCloud