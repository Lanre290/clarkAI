import { useState } from "react";
import Header from "../components/Header";
import { Fade } from "react-awesome-reveal";
import { loadingAnimationOption } from "./UploadPdf";
import Lottie from "react-lottie";
import { toast } from "react-toastify";
import { genAI } from "../script";


const Scanner = () => {

  const [resultText, setResultText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryText =
    "What is in this picture?";

  const generativeFile = async (file: File) => {
    return new Promise<{ data: string; mimeType: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve({ data: base64, mimeType: file.type });
      };
      reader.onerror = (error) => reject(`File reading error: ${error}`);
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Please upload an image smaller than 5MB.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Unsupported file type. Please upload a JPEG or PNG image.");
      return;
    }

    setIsLoading(true);

    try {
      const base64Image = await generativeFile(file);
      await handleRecognize(base64Image);
    } catch (error) {
      console.error("Error processing the image:", error);
      toast.error("An error occurred while processing the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecognize = async (imageData: { data: string; mimeType: string }) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // const result = await model.generateContent([queryText, imageData.data]);
      const structuredInput = {
        query: queryText,
        image: {
          data: imageData.data,
          mimeType: imageData.mimeType,
        },
      };

      console.log(imageData)

      const result = await model.generateContent(structuredInput as any);

      if (!result || !result.response) {
        throw new Error("Invalid response from the AI model.");
      }

      const text = await result.response.text();
      setResultText(text);
      console.log(text)
    } catch (error) {
      console.error("Error during recognition:", error);
      setResultText("Unable to analyze the image. Please try again.");
    }
  };

  return (
    <>
      <Header />
      {isLoading && (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center flex-col z-50">
          <Lottie options={loadingAnimationOption} height={400} width={400} />
          <Fade direction="up" delay={1000} duration={1200}>
            <h3 className="text-white text-4xl text-center">
              Analyzing your image
            </h3>
          </Fade>
        </div>
      )}

      <div className="flex flex-col w-full h-screen overflow-hidden justify-center items-center">
        <div className="w-11/12 md:w-96 h-96 rounded-3xl border border-black p-16 -mt-16">
          <div className="flex flex-col bg-black relative justify-center items-center rounded-3xl h-full w-full">
            <h3 className="text-center text-white text-2xl">
              Upload the image of your question
            </h3>
            <input
              type="file"
              className="absolute top-0 left-0 bottom-0 right-0 opacity-0 z-50 rounded-3xl"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
        </div>
      </div>
      {resultText && (
        <div className="p-4">
          <h2 className="text-2xl font-bold">Result:</h2>
          <p>{resultText}</p>
        </div>
      )}
    </>
  );
};

export default Scanner;
