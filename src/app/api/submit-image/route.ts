// route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY,
});

export async function POST(req: NextRequest) {
  const { base64Image } = await req.json();
  if (!base64Image) {
    return NextResponse.json(
      { error: "base64Image is required" },
      { status: 400 }
    );
  }

  const contents = [
    {
      text: "Add a dog to this photo. Do NOT, under any means, modify any other part of the image. Just add a dog.",
    },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: "Error: No response from the AI model" },
        { status: 500 }
      );
    }

    console.log("Response from AI model:", response);

    if (!response.candidates![0].content) {
      return NextResponse.json(
        { error: `AI Gen Error: ${response.candidates![0].finishReason}` },
        { status: 500 }
      );
    }

    const imagePart = response.candidates![0].content!.parts!.find(
      (part) => part.inlineData
    );

    if (imagePart) {
      const imageData: string = imagePart.inlineData!.data as string;
      // Create a data URL instead of a blob URL
      const dataUrl = `data:image/png;base64,${imageData}`;
      return NextResponse.json({ URL: dataUrl }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "No image part found in the response. Please try again" },
        { status: 500 }
      );
    }
  } catch (e) {
    return NextResponse.json({ error: "Error: " + e }, { status: 500 });
  }
}
