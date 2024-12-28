import { useState } from "react";
import Header from "../components/Header";
import { Fade } from "react-awesome-reveal";
import { loadingAnimationOption } from "./UploadPdf";
import Lottie from "react-lottie";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { CgClose } from "react-icons/cg";
import { geminiModel } from "../App";

const Scanner = () => {
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const [resultText, setResultText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageData, setImageData] = useState<{
    data: string;
    mimeType: string;
  } | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const queryText = `You are a ai study buddy. This is an image, parse it to it's digital format and help your student with this? keep a slow student in mind while explaining. You must solve and explain everything completely in one response Ignore the fact that it is an OCR file, don't mention that part.`;

  // Convert file to base64 and MIME type
  const generativeFile = async (file: File) => {
    return new Promise<{ data: string; mimeType: string }>(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve({ data: base64, mimeType: file.type });
        };
        reader.onerror = (error) => reject(`File reading error: ${error}`);
        reader.readAsDataURL(file);
      }
    );
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "File is too large. Please upload an image smaller than 5MB."
      );
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Unsupported file type. Please upload a JPEG or PNG image.");
      return;
    }

    setIsLoading(true);

    try {
      const base64Image = await generativeFile(file);
      setImageData(base64Image);
      await handleRecognize({ inlineData: base64Image });
    } catch (error) {
      toast.error(
        "An error occurred while processing the image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image recognition
  const handleRecognize = async (imageData: any) => {
    try {
      const model = genAI.getGenerativeModel({ model: geminiModel });
      const result = await model.generateContent([queryText, imageData]);

      if (!result || !result.response) {
        throw new Error("Invalid response from the AI model.");
      }

      const text = await result.response.text();
      setResultText(text);
      setIsSolved(true);
    } catch (error) {
      setResultText("Unable to analyze the image. Please try again.");
    }
  };

  return (
    <div className="overflow-y-hidden pt-20">
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

     
      <a href={"/home"} className="cursor-pointer w-24 flex m-5">
        <BsHouse className="text-black text-5xl"></BsHouse>
      </a>

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

      {isSolved && (
        <Fade direction="up" duration={700} className="flex flex-col gap-y-3 fixed h-4/5 bottom-0 left-0 right-0 rounded-tr-3xl rounded-tl-3xl bg-white z-50 overflow-y-auto shadow-2xl">
          <div className="flex flex-col py-10">
          <div className="flex justify-end h-24 relative">
            <button className="w-14 h-14 text-black z-50 absolute top-0 right-0">
              <CgClose
                className="text-black text-5xl cursor-pointer"
                onClick={() => {
                  setIsSolved(false);
                }}
              />
            </button>
          </div>
          <h3 className="text-black text-2xl p-5 pb-20">
            <ReactMarkdown className='gap-y-2'>{resultText}</ReactMarkdown>
          </h3>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default Scanner;
