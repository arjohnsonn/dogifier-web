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
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log("Rate limit response:", data);
  if (!response.ok) {
    return {
      Error: "Error: " + data.error,
    };
  } else if (!data) {
    return {
      Error: "Error: You have reached the limit of 3 images generations.",
    };
  }

  const base64Image = await fileToBase64(props.imagePath);

  const response2 = await fetch("/api/submit-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64Image: base64Image }),
  });

  const responseJson = await response2.json();
  if (!response2.ok) {
    return {
      Error: "" + responseJson.error,
    };
  }

  await fetch("/api/rate-limit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  console.log("Image submitted successfully:", responseJson);

  return { URL: responseJson.URL };
};

export default submitImage;
