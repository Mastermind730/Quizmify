import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import prisma from "@/lib/prismadb";
import axios from "axios";

export async function POST(req:Request,res:Response){
    try {
        const session=await getAuthSession();
        if(!session?.user){
          return NextResponse.json({
            error:"You must be logged in to create a quiz",
          },{status:401}
        )
        }

        const body=await req.json();
        const{amount,topic,type}=quizCreationSchema.parse(body);

        const game=await prisma.game.create({
            data:{
                gameType:type,
                timeStarted:new Date(),
                userId:session.user.id,
                topic
            }
        })

        const {data}=await axios.post(`${process.env.API_URL}/api/questions`,{
            amount,
            topic,
            type
        });
        if(type==="mcq"){
            type mcqQuestion={
                question:string,
                answer:string,
                option1:string,
                option2:string,
                option3:string,
                option4:string,
            }
           let manyData=data.questions.map((question:mcqQuestion)=>{
            let options=[question.answer,question.option1,question.option2,question.option3,question.option4];
            options=options.sort(()=>Math.random()-.5)
            return{
                question:question.question,
                answer:question.answer,
                options:JSON.stringify(options),
                gameId:
            }
           })
           await prisma.question.create({
            data:manyData
           }) 
        }


    } catch (error:any) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
          }
          return NextResponse.json({
            error:"Something went wrong"
          },{status:500})
    }
}