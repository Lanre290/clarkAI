import { PiArrowUpBold, PiUpload, PiWaveform } from "react-icons/pi";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { toast } from "react-toastify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfToText from "react-pdftotext";
import ReactMarkdown from "react-markdown";
import Lottie from "react-lottie";
import loadingAnimationData from "./../assets/animations/loadingAnimation2.json";
import suggestQuestion from "../script";

export interface messageInterface {
  fromUser: boolean;
  message: string;
}

export const loadingAnimationOption = {
  loop: true, // Set to false if you don't want it to loop
  autoplay: true, // Set to true to autoplay the animation
  animationData: loadingAnimationData, // The JSON data for the animation
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const UploadPdf = () => {
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const divHeight = screen.height - 190;
  const chatArea = useRef(null);

  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [pdfMode, setPdfMode] = useState<"summary" | "explain" | "elaborate">(
    "summary"
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [hasAppLoaded, setHasAppLoaded] = useState(false);
  const [result, setResult] = useState<string>("");
  const [pdfText, setPDFText] = useState<string>("");
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const [queryText, setQueryText] = useState<string>(
    "You are an educational assistant and study buddy. Summarize the content of this document, focusing on the key points and main ideas. Provide a concise overview that captures the essence of the document and also aids the student you are helping while leaving out unnecessary details"
  );
  const [suggestedQuestion, setSuggestedQuestion] = useState<string>("");

  const handleAI = async (file: any) => {
    setIsLoadingPDF(true);
    pdfToText(file)
      .then(async (text) => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result_ = await model.generateContent([queryText, text]); // TO-DO: add safety setting
        const response = await result_.response;
        const aiText = await response.text();
        aiText.substring(7, aiText.length - 3);
        setResult(aiText);
        setPDFText(aiText);
        setIsLoadingPDF(false);
      })
      .catch(() => {
        toast.error("Failed to extract text from pdf")
        setIsLoadingPDF(false);
        setPdfFile(null)
      });
  };

  //   useEffect for when user changes the type of explanation they want
  useEffect(() => {
    try {
      if (hasAppLoaded == true) {
        handleAI(pdfFile);
      } else {
        setHasAppLoaded(true);
      }
    } catch (error) {
      toast.error("Error reading file.");
    }
  }, [queryText]);

  const changeFile = async (e: any) => {
    let file: File = e.target.files[0];
    setFilename(file.name);

    if (file && file.type === "application/pdf") {
      setIsLoadingPDF(true);
      setPdfFile(file);

      handleAI(file);
    } else {
      console.error("Please upload a valid PDF file");
    }
  };

  const generateAIAnswer = async (
    dependencies: string[],
    userMessage: messageInterface
  ) => {
    setSuggestedQuestion("");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result_ = await model.generateContent(['You are clarkAI, an AI educational assistant. This is the conversation between a person and you as an AI model, go through the conversation and answer the last question accordingly or reply the human accordingly. Respond directly from your perspective, avoiding statements that reference the user\'s actions or context explicitly (e.g., \'the user did this or that\'). ', ...dependencies]);
    const response = await result_.response;
    const aiText = await response.text();
    aiText.substring(7, aiText.length - 3);

    let aiResponse = {
      fromUser: false,
      message: aiText,
    };

    setMessages([...messages, userMessage, aiResponse]);
    setIsTyping(false);
    const AISuggestedQuestion = suggestQuestion(dependencies);
    const newQuestion = await AISuggestedQuestion;
    if (suggestedQuestion != newQuestion) {
      setSuggestedQuestion(newQuestion); //check if there was an erro generating question
    }
  };

  const submitPDFQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsTyping(true);
      if (message.trim().length == 0) {
        throw new Error();
      }

      if (filename.length == 0) {
        throw new Error("Upload a PDF file to interact with AI.");
      }

      let processedMessage = {
        fromUser: true,
        message: message,
      };
      setMessages([...messages, processedMessage]);
      setMessage("");

      generateAIAnswer([JSON.stringify(messages), message, pdfText], processedMessage);

      const chatElement = chatArea.current as unknown as HTMLElement;
      chatElement.scrollTop = chatElement.scrollHeight;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Header></Header>

      {/* loading animation div */}
      {isLoadingPDF && (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center flex-col z-50">
          <Lottie options={loadingAnimationOption} height={400} width={400} />
          <Fade direction="up" delay={1000} duration={1200}>
            <h3 className="text-white text-4xl text-center">
              Analyzing your pdf
            </h3>
          </Fade>
        </div>
      )}

      <div className="w-full h-full flex md:flex-row">
        <div
          className="md:w-2/3 lg:w-4/6 h-full overflow-y-auto"
          style={{ height: divHeight }}
        >
          <div className="flex flex-row items-center justify-start mt-7 ml-10 gap-x-3">
            <button className="bg-black text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl relative">
              <PiUpload className="text-2xl"></PiUpload>
              upload PDF
              <input
                type="file"
                name=""
                className="absolute top-0 right-0 left-0 bottom-0 rounded-3xl z-50 cursor-pointer opacity-0"
                onChange={changeFile}
                accept=".pdf"
              />
            </button>

            <h3 className="text-black text-3xl h-full flex items-center justify-start w-1/2 truncate">
              {filename}
            </h3>
          </div>

          <div className="flex flex-row ml-10 mt-2 gap-x-2">
            <button
              className={`${
                pdfMode == "summary" ? "bg-black text-white" : "text-black"
              } border border-black rounded-3xl ${
                pdfFile == null
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl`}
              title={pdfFile == null ? "Upload a pdf file" : "Summarize my PDF"}
              disabled={pdfFile == null}
              onClick={() => {
                setPdfMode("summary");
                setQueryText(
                  "You are an educational assistant and study buddy. Summarize the content of this document, focusing on the key points and main ideas. Provide a concise overview that captures the essence of the document and also aids the student you are helping while leaving out unnecessary details. Provide response is original markdown format."
                );
              }}
            >
              Summarize
            </button>
            <button
              className={`${
                pdfMode == "explain" ? "bg-black text-white" : "text-black"
              } border border-black rounded-3xl ${
                pdfFile == null
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl`}
              title={
                pdfFile == null ? "Upload a pdf file" : "Explain PDF Simply"
              }
              disabled={pdfFile == null}
              onClick={() => {
                setPdfMode("explain");
                setQueryText(
                  "You are an educational assistant and study buddy. Provide a simple, easy-to-understand explanation of the main topics covered in this document. Make sure to break down complex concepts into straightforward language so that students with little prior knowledge can grasp the ideas easily. Provide response is original markdown format."
                );
              }}
            >
              Simple explanation
            </button>
            <button
              className={`${
                pdfMode == "elaborate" ? "bg-black text-white" : "text-black"
              } border border-black rounded-3xl ${
                pdfFile == null
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl`}
              title={pdfFile == null ? "Upload a pdf file" : "Elaborate PDF"}
              disabled={pdfFile == null}
              onClick={() => {
                setPdfMode("elaborate");
                setQueryText(
                  "You are an educational assistant and study buddy. Elaborate widely and in a simple manner the topics discussed in this document, offering a detailed explanation that covers the main concepts, examples, and insights. Aim to provide a deeper understanding of the content, explaining the context and significance of each topic while maintaining clarity. Provide response is original markdown format."
                );
              }}
            >
              Elaborate explanation
            </button>
          </div>

          <div className="p-5">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>

        {/* chat area */}
        <div
          className="md:w-1/3 lg:w-2/6 h-full border-l border-gray-400 flex flex-col justify-end relative"
          ref={chatArea}
          style={{ height: divHeight, transitionDuration: "0.5s" }}
        >
          {messages.length == 0 && (
            <h3 className="text-4xl text-black text-center my-auto">
              Hello Sheriff, Ask me any question about your pdf?
            </h3>
          )}

          {/* main chat area div */}

          {messages.length > 0 && (
            <div className="h-full w-full pt-7 gap-y-2 flex flex-col overflow-y-auto px-5 pb-24">
              {messages.map((message: messageInterface) => {
                return (
                  <div
                    className={`flex items-center ${
                      message.fromUser == true ? "justify-end" : "justify-start"
                    } h-min`}
                  >
                    <div
                      className={`${
                        message.fromUser == true
                          ? "rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl bg-black text-white"
                          : "rounded-tr-2xl rounded-tl-2xl rounded-br-2xl bg-gray-200 text-black"
                      } p-4 w-fit`}
                      style={{ maxWidth: "75%" }}
                    >
                      <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="w-full">
                  <div
                    className="flex flex-row p-3 pt-0 bg-gray-100 message-from items-center justify-center relative h-20 mb-10"
                    style={{ width: "137px" }}
                  >
                    <div
                      className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute"
                      style={{ left: "16px", animationDelay: "0s" }}
                    ></div>
                    <div
                      className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute"
                      style={{ left: "52px", animationDelay: "0.25s" }}
                    ></div>
                    <div
                      className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute"
                      style={{ left: "92px", animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>
              )}

              {suggestedQuestion.trim().length > 0 && (
                <div
                  className={`text-black border border-black rounded-3xl flex flex-row bg-transparent gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl hover:bg-gray-200 cursor-pointer`}
                  onClick={async () => {
                    setIsTyping(true);
                    let processedMessage = {
                      fromUser: true,
                      message: suggestedQuestion,
                    };
                    setMessages([...messages, processedMessage]);
                    generateAIAnswer(
                      [JSON.stringify(messages), suggestedQuestion, pdfText],
                      processedMessage
                    );
                  }}
                >
                  {suggestedQuestion}
                </div>
              )}
            </div>
          )}

          <form
            className="flex flex-row w-11/12 mx-auto bg-gray-200 p-2 gap-x-2 absolute bottom-2 left-2 right-2"
            style={{ borderRadius: "45px" }}
            onSubmit={submitPDFQuestion}
          >
            <input
              type="text"
              className="bg-transparent flex flex-grow w-full focus:outline-none px-5 text-xl"
              placeholder="Message ClarkAI"
              onInput={(e: any) => {
                setMessage(e.target.value);
              }}
              value={message}
            />
            <button
              className={`w-12 h-12 min-w-12 rounded-full bg-black flex items-center justify-center ${
                pdfFile == null && "opacity-50 cursor-not-allowed"
              }`}
              style={{ minWidth: "48px" }}
              disabled={message.length > 0 && pdfFile !== null && false}
            >
              <PiWaveform className="text-white text-2xl"></PiWaveform>
            </button>

            {message.length > 0 && (
              <Fade direction="left" duration={260}>
                <button
                  className={`w-12 h-12 min-w-12 rounded-full bg-black flex items-center justify-center ${
                    pdfFile == null && "opacity-50 cursor-not-allowed"
                  }`}
                  style={{ minWidth: "48px" }}
                  disabled={message.length > 0 && pdfFile !== null && false}
                  type="submit"
                >
                  <PiArrowUpBold className="text-white text-2xl"></PiArrowUpBold>
                </button>
              </Fade>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadPdf;
