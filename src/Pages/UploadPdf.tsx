import {
  PiArrowUpBold,
  PiDownloadThin,
  PiRobotThin,
  PiUpload,
  PiWaveform,
} from "react-icons/pi";
import Header from "../components/Header";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { toast } from "react-toastify";
import pdfToText from "react-pdftotext";
import ReactMarkdown from "react-markdown";
import Lottie from "react-lottie";
import loadingAnimationData from "./../assets/animations/loadingAnimation2.json";
import { genAI, SpeechSynthesisService } from "../script";
import { suggestQuestion } from "../script";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { BsHouse } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { jsPDF } from "jspdf";
import { BiCopy, BiPause, BiPlay, BiStop, BiVolumeFull } from "react-icons/bi";
import Listening from "../components/Listening";

export interface messageInterface {
  src?:string;
  video?:boolean;
  fromUser: boolean;
  message: string;
}

export const loadingAnimationOption = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const UploadPdf = () => {
  const divHeight = screen.height - 190;
  const chatArea = useRef(null);
  const pdfHTMLElement = useRef(null);

  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [speechText, setSpeechText] = useState("");
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
  const [name, setName] = useState<string>("");
  const [chatScreen, setChatScreen] = useState<boolean>(
    screen.width > 768 ? true : false
  );
  const [speechService, setSpeechService] =
    useState<SpeechSynthesisService | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingPaused, setIsSpeakingPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [currentVoice, setCurrentVoice] = useState<string>();
  const [isListening, setIsListening] = useState(false);
  const [isMessageByVoice, setIsMessageByVoice] = useState(false);
  const [speechToTextResponse, setSpeechToTextResponse] = useState("");

  const submitMessageButton = useRef<null | HTMLButtonElement>(null);
  const readButton = useRef<null | HTMLButtonElement>(null);

  const SpeechRecognition = new ((window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition)();

  const { user, setUser } = useUser();

  useEffect(() => {
    const service = new SpeechSynthesisService(speechText);
    setSpeechService(service);
    setVoices(speechService?.getVoices());

    try {
      (speechService as any).utterance.onend = () => {
        setIsSpeaking(false);
      };
    } catch (error) {}
    return () => {
      service.stop();
    };
  }, [speechText]);

  useEffect(() => {
    const user_: any = JSON.parse(localStorage.getItem("user") as string);
    if (!user) {
      setUser(user_);
      setName(user_?.name as string);
    } else {
      setName(user_?.name as string);
    }
  }, []);

  const handleAI = async (file: any) => {
    setIsLoadingPDF(true);
    pdfToText(file)
      .then(async (text) => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result_ = await model.generateContent([queryText, text]);
        const response = await result_.response;
        const aiText = await response.text();
        aiText.substring(7, aiText.length - 3);
        setResult(aiText);
        setPDFText(aiText);
        setIsLoadingPDF(false);
      })
      .catch(() => {
        toast.error("Failed to extract text from pdf");
        setIsLoadingPDF(false);
        setPdfFile(null);
      });
  };

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

  SpeechRecognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript;
    setMessage(text);
    setIsMessageByVoice(true);
    setSpeechToTextResponse(text);
    setIsListening(false);
  };

  SpeechRecognition.onend = () => {
    setIsListening(false);
  };

  const handleListen = () => {
    if (isListening) {
      SpeechRecognition.stop();
      setIsListening(false);
    } else {
      SpeechRecognition.start();
      setIsListening(true);
    }
  };

  const generateAIAnswer = async (
    dependencies: string[],
    userMessage: messageInterface
  ) => {
    setSuggestedQuestion("");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result_ = await model.generateContent([
      "You are clarkAI, an AI educational assistant. This is the conversation between a person and you as an AI model, go through the conversation and answer the last question from the human accordingly Respond directly from your perspective, avoiding statements that reference the user's actions or context explicitly (e.g., 'the user did this or that'). Feel free to research the internet for more information.",
      ...dependencies,
    ]);
    const response = await result_.response;
    const aiText = await response.text();
    aiText.substring(7, aiText.length - 3);

    let aiResponse = {
      fromUser: false,
      message: aiText,
    };

    setMessages([...messages, userMessage, aiResponse]);
    setIsTyping(false);

    setIsMessageByVoice(false);
    const AISuggestedQuestion = suggestQuestion(dependencies);
    const newQuestion = await AISuggestedQuestion;
    if (suggestedQuestion != newQuestion) {
      setSuggestedQuestion(newQuestion);
    }

    aiSpeak(aiResponse.message);
  };

  const aiSpeak = (text: string) => {
    if (isMessageByVoice) {
      setSpeechText(text);
      if (currentVoice) {
        speechService?.setVoice(currentVoice);
      }
      speechService?.stop();
      setTimeout(() => {
        readButton.current?.click();
      }, 500);
      setIsSpeaking(true);
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Select the HTML element
    const content: HTMLElement =
      pdfHTMLElement.current as unknown as HTMLElement;

    // Get the dimensions of the content
    const contentWidth = content.offsetWidth - 20;
    const contentHeight = content.offsetHeight;

    // Calculate the scaling factor to fit the content to the PDF
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const scale = Math.min(
      pageWidth / contentWidth,
      pageHeight / contentHeight
    );

    doc.html(content, {
      callback: () => {
        doc.save(`${filename}_${pdfMode}.pdf`);
      },
      margin: [10, 10, 10, 10],
      html2canvas: {
        scale, // Dynamically set scale based on content size
      },
    });
  };

  const submitPDFQuestion = async (e?: React.FormEvent) => {
    try {
      (e as any).preventDefault();
    } catch (error) {
      
    }

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

      generateAIAnswer(
        [JSON.stringify(messages), message, pdfText],
        processedMessage
      );

      const chatElement = chatArea.current as unknown as HTMLElement;
      chatElement.scrollTop = chatElement.scrollHeight;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      submitPDFQuestion()
    }, 300);
  }, [speechToTextResponse]);

  return (
    <>
      <Header></Header>

      {/* loading animation div */}
      {isLoadingPDF && (
        <div
          className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center flex-col"
          style={{ zIndex: 99999 }}
        >
          <Lottie options={loadingAnimationOption} height={400} width={400} />
          <Fade direction="up" delay={1000} duration={1200}>
            <h3 className="text-white text-4xl text-center">
              Analyzing your pdf
            </h3>
          </Fade>
        </div>
      )}

      {isListening && (
        <Listening></Listening>
      )}

      {isSpeaking && (
        <div
          className="fixed flex flex-col top-2 left-2 md:left-auto md:right-2 md:top-56 bg-black py-5 pl-5 pr-20 rounded-2xl z-50"
          style={{ zIndex: 99999 }}
        >
          <div className="flex flex-row gap-x-3 mt-5">
            <button
              className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-gray-50 hover:bg-opacity-30"
              onClick={() => {
                if (isSpeakingPaused) {
                  speechService?.play();
                  setIsSpeakingPaused(false);
                } else {
                  speechService?.pause();
                  setIsSpeakingPaused(true);
                }
              }}
            >
              {isSpeakingPaused == false ? (
                <BiPause className="text-3xl text-white"></BiPause>
              ) : (
                <BiPlay className="text-3xl text-white"></BiPlay>
              )}
            </button>
            {isSpeaking && (
              <button
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-gray-50 hover:bg-opacity-30"
                onClick={() => {
                  speechService?.stop();
                  setIsSpeaking(false);
                }}
              >
                <BiStop className="text-3xl text-white"></BiStop>
              </button>
            )}
          </div>
          <select
            className="py-2 px-5 rounded-2xl cursor-pointer border border-white bg-transparent mt-5 text-white w-48"
            onInput={(e: any) => {
              speechService?.setVoice(e.target.value);
              setCurrentVoice(e.target.value);
            }}
          >
            <option value="" className="bg-black text-white">
              Change voice
            </option>
            {voices?.map((voice) => {
              return (
                <option value={voice.name} className="bg-black text-white">
                  {voice.name}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <div className="w-full h-full flex md:flex-row">
        <div
          className="md:w-2/3 lg:w-4/6 w-full h-full overflow-y-auto"
          style={{ height: screen.width > 768 ? divHeight : "100vh" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-start w-full mt-7 md:ml-10 gap-x-3 gap-y-2">
            <div className="flex flex-row items-center justify-start w-full md:w-min">
              <Link to={"/home"} className="p-4 cursor-pointer">
                <BsHouse className="text-black text-5xl"></BsHouse>
              </Link>
              <button className="bg-black text-white rounded-3xl cursor-pointer w-64 h-12 md:h-auto flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl relative">
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
              {screen.width < 768 && (
                <button
                  className="p-4 cursor-pointer"
                  onClick={() => {
                    setChatScreen(true);
                  }}
                >
                  <PiRobotThin className="text-black text-5xl"></PiRobotThin>
                </button>
              )}
            </div>

            <h3 className="text-black text-3xl h-full flex items-center justify-start w-1/2 truncate">
              {filename}
            </h3>
          </div>

          <div className="flex flex-col md:flex-row justify-start md:ml-10 mt-2 gap-x-2">
            <button
              className={`${
                pdfMode == "summary" ? "bg-black text-white" : "text-black"
              } border border-black rounded-3xl ${
                pdfFile == null
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl w-11/12 md:w-auto md:mx-0 mx-auto my-1`}
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
              } flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl w-11/12 md:w-auto md:mx-0 mx-auto my-1`}
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
              } flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl w-11/12 md:w-auto md:mx-0 mx-auto my-1`}
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

          <div className="p-5" ref={pdfHTMLElement}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>

        {/* chat area */}
        {chatScreen && (
          <div
            className="md:w-1/3 lg:w-2/6 h-full fixed top-0 bottom-0 left-0 right-0 bg-white pt-20 md:pt-0 md:mt-7 md:static overflow-y-hidden"
            style={{
              height: screen.width > 768 ? divHeight : "100vh",
              zIndex: screen.width < 768 ? 999 : 5,
              msTransitionDuration: "0.5s",
            }}
          >
            {screen.width < 768 && (
              <button className="">
                <button className="w-14 h-14 text-black z-50 absolute top-0 right-0">
                  <CgClose
                    className="text-black text-5xl cursor-pointer"
                    onClick={() => {
                      setChatScreen(false);
                    }}
                  />
                </button>
              </button>
            )}
            <div
              className="w-full h-full border-l border-gray-400 flex flex-col justify-end relative"
              ref={chatArea}
            >
              {messages.length == 0 && (
                <h3 className="text-4xl text-black text-center my-auto">
                  Hello {name.split(" ").length > 1 ? name.split(" ")[1] : name}
                  , Ask me any question about your pdf?
                </h3>
              )}

              {/* main chat area div */}

              {messages.length > 0 && (
                <div className="h-full w-full pt-7 gap-y-2 flex flex-col overflow-y-auto px-5 mb-28 md:pb-24">
                  {messages.map((message: messageInterface) => {
                    return (
                      <div
                        className={`flex flex-col justify-center ${
                          message.fromUser == true ? "items-end" : "items-start"
                        } h-min`}
                      >
                        <div
                          className={`${
                            message.fromUser == true
                              ? "rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl bg-black text-white"
                              : "rounded-tr-2xl rounded-tl-2xl rounded-br-2xl bg-gray-200 text-black"
                          } p-4 w-fit`}
                          style={{ maxWidth: "85%" }}
                        >
                          <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                        {message.fromUser == false && (
                          <div className="flex flex-row">
                            <button
                              ref={readButton}
                              onClick={() => {
                                speechService?.stop();
                                setIsSpeaking(false)
                                setSpeechText(message.message);
                                if (currentVoice) {
                                  speechService?.setVoice(currentVoice);
                                }
                                speechService?.speak();
                                speechService?.speak();
                                setIsSpeaking(true);
                              }}
                              className="cursor-pointer mt-1 mb-3 p-3 rounded-full hover:bg-gray-200"
                            >
                              <BiVolumeFull className="text-black text-2xl"></BiVolumeFull>
                            </button>
                            <button
                              className="cursor-pointer mt-1 mb-3 p-3 rounded-full hover:bg-gray-200"
                              onClick={() => {
                                navigator.clipboard.writeText(message.message);
                                toast.info("Text copied to clipboard.");
                              }}
                            >
                              <BiCopy className="text-black text-2xl"></BiCopy>
                            </button>
                          </div>
                        )}
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
                          [
                            JSON.stringify(messages),
                            suggestedQuestion,
                            pdfText,
                          ],
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
                className="flex flex-row w-11/12 mx-auto bg-gray-200 p-2 gap-x-2 absolute bottom-10 md:bottom-2 left-2 right-2"
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
                  type="button"
                  onClick={handleListen}
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
                      ref={submitMessageButton}
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
        )}
      </div>

      {pdfFile !== null && (
        <button
          className="fixed bottom-10 left-3 md:right-auto cursor-pointer bg-black p-5 rounded-full"
          title="download pdf"
          onClick={generatePDF}
          style={{ zIndex: 99 }}
        >
          <PiDownloadThin className="text-4xl text-white"></PiDownloadThin>
        </button>
      )}
    </>
  );
};

export default UploadPdf;
