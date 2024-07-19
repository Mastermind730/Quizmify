import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { chatSession } from "@/lib/Gemini";

export const POST = async (req: Request) => {
  try {
    console.log("request reached")
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    let questions: any;
    if (type === "open_ended") {
      const prompt = `You are a helpful AI that is able to generate a pair of questions and answers. The length of the answer should not exceed 15 words. Store all the pairs of answers and questions in a JSON array. You are to generate a random hard open-ended question about ${topic}.`;
        console.log("request going to send now")
      // Start the chat session and send the prompt
      const chat = await chatSession.sendMessage(prompt);


      console.log(chat.response.text().replace('```json','').replace('```',''))
      let responseText=chat?.response.text().replace('```json','').replace('```','').trim()



      const parts = responseText.split('**');
  
      // The JSON data is in the first part of the split array
      const jsonDataString = parts[0].trim();
    //   console.log(jsonDataString)
       // Remove the specific part
       
    //   // Extract the response text
      questions = JSON.parse(jsonDataString);
    //   console.log(questions)
    // questions=[]
    }
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.log(error)
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
};
