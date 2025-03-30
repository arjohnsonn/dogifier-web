import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY,
});

type Props = {
  imagePath: string; // URL path to the image, e.g., '/assets/image.png'
};

// Helper function: Fetch the image, convert to blob, then to a base64 string
// We can't use node module FS in a browser unfortunately
async function fileToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result is in the format "data:image/png;base64,XXXX"
      const dataUrl = reader.result as string;
      // Remove the prefix if needed:
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const submitImage = async (props: Props) => {
  const response = await fetch("/api/rate-limit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) {
    return {
      Error: "Error: " + data.error,
    };
  } else {
    console.log("Success:", data);
  }

  const { imagePath } = props;
  const base64Image = await fileToBase64(imagePath);

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
      return {
        Error: "Error: No response from AI. Please try again",
      };
    }

    const imagePart = response.candidates![0].content!.parts!.find(
      (part) => part.inlineData
    );

    if (imagePart) {
      const imageData: string = imagePart.inlineData!.data as string;

      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      const url = URL.createObjectURL(blob);

      return {
        URL: url,
      };
    } else {
      return {
        Error: "Error: No image part found in the response. Please try again",
      };
    }
  } catch (e) {
    return {
      Error: "Error: " + e + " Response: " + JSON.stringify(response),
    };
  }
};

export default submitImage;
