"use client";
import { useTheme } from 'next-themes';
import React from 'react'
import D3WordCloud from "react-d3-cloud";

type Props = {}
const data=[
    {
text:"Hey",
value:3
},
    {
text:"Hi",
value:7
},
    {
text:"How",
value:9
},
    {
text:"Yup",
value:12
},
]


const fontSizeWrapper=(word:{value:number})=>{
    return Math.log2(word.value)*5 +16
}



const CustomWordCloud = (props: Props) => {
    const theme=useTheme()
  return (
    <>
      <D3WordCloud
      height={550}
      data={data}
      font={"Times"}
      fontSize={fontSizeWrapper}
      rotate={0}
      padding={10}
      fill={theme.theme =="dark"?"white":"black"}

      />  
    </>
  )
}

export default CustomWordCloud