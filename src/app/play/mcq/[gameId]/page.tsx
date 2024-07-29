import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'
import prisma from "@/lib/prismadb";
import MCQ from '@/components/MCQ';
type Props = {
    params:{
        gameId:string;
    }
}

const page = async({params:{gameId}}: Props) => {
    const session=await getAuthSession();
    if(!session?.user){
        return redirect("/");
    }
    const game=await prisma.game.findUnique({
        where:{id:gameId},
        include:{questions:{
            select:{
                id:true,
                question:true,
                options:true,
            },
        }}
    })

    if(!game || game.gameType!=="mcq"){
        return redirect("/quiz");
    }
  return (
    <div>
        <MCQ game={game}/>
    </div>
  )
}

export default page