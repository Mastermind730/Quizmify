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
      const prompt = `You are a helpful AI that is able to generate pairs of questions and answers. The length of each answer should not exceed 15 words. Store all the pairs of questions and answers in a JSON array. You are to generate ${amount} random hard open-ended questions about ${topic}. Each entry in the JSON array should be of the format: {"question": "Your question here", "answer": "Your answer here"}.`;
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
    }else if(type==="mcq"){
      const prompt = `You are a helpful AI that is able to generate multiple-choice questions (MCQs) and answers. Each question should be in the following JSON format:
      {
        "question": "The question text",
        "answer": "The correct answer",
        "option1": "First option",
        "option2": "Second option",
        "option3": "Third option",
        "option4": "Fourth option"
      }
      Generate ${amount} MCQs on the topic of ${topic}. Ensure that the correct answer is one of the options and the length of the answer does not exceed 15 words.`;        console.log("request going to send now")
      // Start the chat session and send the prompt
      const chat = await chatSession.sendMessage(prompt);
      let responseText = await chat.response.text();
      responseText = responseText.replace('```json', '').replace('```', '').trim();
      console.log(responseText)
      questions = JSON.parse(responseText);
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
