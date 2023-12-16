import { NextResponse } from "next/server";
import openai from "@/openai";

export async function POST(request: Request) {
  //todos in the body of post request
  const { todos } = await request.json();

  // communicate with OpenAI GPT
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome the user as Mr. Pradeep and say welcome to Trello-clone! Limit the response to 200 characters ",
      },
      {
        role: "user",
        content: `Hi there, provide me the summary of the following todos. Count how many todos are in each category such as todo, in progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });


//   console.log(response.choices[0].message);
  return NextResponse.json(response.choices[0].message)
}
