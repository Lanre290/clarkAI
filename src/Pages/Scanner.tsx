import { useState } from "react";
import Header from "../components/Header";
import { Fade } from "react-awesome-reveal";
import { loadingAnimationOption } from "./UploadPdf";
import Lottie from "react-lottie";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { geminiModel } from "../App";
import { BiEdit } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import rehypeRaw from "rehype-raw";

const Scanner = () => {
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const [resultText, setResultText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageData, setImageData] = useState<{
    data: string;
    mimeType: string;
  } | null>(null);
  const [imageURL, setImageURL] = useState<string>('');
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);

  const queryText = `You are a ai study buddy. This is an image, parse it to it's digital format and help your student with this? keep a slow student in mind while explaining. You must solve and explain everything completely in one response Ignore the fact that it is an OCR file, don't mention that part. You must respond in pure markdown format.`;

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

    setImageURL(URL.createObjectURL(file));

    if (file.size > 20 * 1024 * 1024) {
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
    } catch (error) {
      setResultText("Unable to analyze the image. Please try again.");
    }
  };

  return (
    <div className="overflow-hidden pt-20">
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

      <div className="flex flex-row w-full h-screen overflow-hidden justify-center items-center">
        {
          imageURL == '' && (
            <div className="flex justify-center items-center w-full md:w-min px-8 border-r border-black h-screen">
              <div className="w-11/12 md:w-96 h-96 rounded-3xl border border-black p-16 -mt-16">
                <div className="flex flex-col bg-black relative justify-center items-center rounded-3xl h-full w-full">
                  <h3 className="text-center text-white text-2xl">
                    Upload the image of your question
                  </h3>
                  <input
                    type="file"
                    className="absolute top-0 left-0 bottom-0 right-0 opacity-0 z-50 rounded-3xl"
                    onInput={handleImageChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          )
        }

        {
          imageURL != '' && (
            <div className="flex justify-center items-center w-full md:w-min px-8 border-r border-black h-screen">
              <div className="w-96 h-96 relative min-w-80 bg-gray-400">
                <img src={imageURL} alt="image" className="w-full h-full rounded-2xl object-contain cursor-pointer" onClick={() => {setShowImageFullscreen(true)}}/>

                <div className="absolute bottom-2 right-2 bg-white w-16 h-16 rounded-full flex items-center justify-center">
                  <div className="relative justify-center items-center rounded-full h-16 w-16 z-50">
                    <button className="w-16 h-16 cursor-pointer rounded-full flex items-center justify-center">
                      <BiEdit className="text-2xl text-black "></BiEdit>
                    </button>
                    <input
                      type="file"
                      className="absolute top-0 left-0 bottom-0 right-0 opacity-0 z-50 rounded-full cursor-pointer"
                      onInput={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }


        <div className="flex flex-grow pt-24 overflow-y-hidden h-screen pb-24">
          <h3 className="text-black text-2xl px-3 overflow-y-auto h-full result-h3">
            <ReactMarkdown className='gap-y-2' rehypePlugins={[rehypeRaw]}>{resultText}</ReactMarkdown>
          </h3>
        </div>
      </div>

      {
        showImageFullscreen && (
          <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center py-2 z-50" onClick={(e) => {
            e.stopPropagation();
            setShowImageFullscreen(false);
          }}>
            <button className="w-16 h-16 rounded-full flex items-center justify-center fixed top-10 right-10" onClick={() => {
              setShowImageFullscreen(false);
            }}>
              <CgClose className="text-2xl text-black"></CgClose>
            </button>
            <img src={imageURL} alt="image" className="h-full object-cover cursor-pointer" onClick={(e) => {e.stopPropagation()}}/>
          </div>
        )
      }
    </div>
  );
};

export default Scanner;