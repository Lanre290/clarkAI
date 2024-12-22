import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import {
  BiCopy,
  BiEdit,
  BiPause,
  BiPlay,
  BiStop,
  BiVolumeFull,
} from "react-icons/bi";
import { PiArrowDown, PiArrowUpBold, PiUserCircleThin, PiWaveform } from "react-icons/pi";
import { Link } from "react-router-dom";
import { messageInterface } from "./UploadPdf";
import { toast } from "react-toastify";
import { suggestQuestion, SpeechSynthesisService } from "../script";
import ReactMarkdown from "react-markdown";
import { genAI } from "../script";
import { useUser } from "../context/UserContext";
import { BsHouse } from "react-icons/bs";
import Listening from "../components/Listening";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [suggestedQuestion, setSuggestedQuestion] = useState<string>("");
  const [previousChats, setPreviousChats] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const chatArea = useRef(null);
  const [speechService, setSpeechService] =
    useState<SpeechSynthesisService | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingPaused, setIsSpeakingPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [currentVoice, setCurrentVoice] = useState<string>();
  const [isListening, setIsListening] = useState(false);
  const [isMessageByVoice, setIsMessageByVoice] = useState(false);
  const [speechToTextResponse, setSpeechToTextResponse] = useState("");
  const [speechText, setSpeechText] = useState("");

  const readButton = useRef<null | HTMLButtonElement>(null);
  const { user, setUser } = useUser();
  const SpeechRecognition = new ((window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition)();
  const chatWindow = useRef<HTMLDivElement & any>();

  useEffect(() => {
    if (!user) {
      const user = JSON.parse(localStorage.getItem("user") as string);
      setUser(user);
      setName(user?.user.name as string);
    } else {
      setName(user?.user.name as string);
    }
  }, []);

  useLayoutEffect(() => {
    setTimeout(() => {
      submitQuestion();
    }, 300);
  }, [speechToTextResponse]);

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

  const generateAIAnswer = async (
    dependencies: string[],
    userMessage: messageInterface
  ) => {
    setSuggestedQuestion("");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result_ = await model.generateContent([
      "You are clarkAI, an AI educational assistant. This is the conversation between a person and you as an AI model, go through the conversation and answer the last question accordingly or reply the human accordingly. Respond directly from your perspective, avoiding statements that reference the user's actions or context explicitly (e.g., 'the user did this or that'). you MUST make sure and crosscheck you are answering the last question.",
      ...dependencies,
      message,
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
      setSuggestedQuestion(newQuestion); //check if there was an error generating question
    }

    scrollToBottom()
    aiSpeak(aiResponse.message);
  };

  const scrollToBottom = () => {
    chatWindow.current?.scrollBy({top: chatWindow.current.scrollHeight, behavior: 'smooth'});
  }

  const submitQuestion = async (e?: React.FormEvent) => {
    try {
      (e as any).preventDefault();
    } catch (error) {}

    try {
      setIsTyping(true);
      if (message.trim().length == 0) {
        throw new Error();
      }

      let processedMessage = {
        fromUser: true,
        message: message,
      };
      setMessages([...messages, processedMessage]);
      setMessage("");

      console.log(JSON.stringify(messages));

      generateAIAnswer(
        [JSON.stringify(processedMessage), JSON.stringify(messages)],
        processedMessage
      );

      scrollToBottom();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const createNewChat = () => {
    let previousChatObject = {
      title: messages[0].message,
      messages: messages,
    };

    setPreviousChats([...previousChats, previousChatObject]);
    setMessages([]);
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

  return (
    <div className="w-full h-full flex flex-row chat-page">
      {isListening && <Listening></Listening>}

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
      <div className="hidden md:flex flex-col h-screen w-72 overflow-y-auto bg-gray-100">
        <div className="flex flex-row my-5 px-6 items-center justify-between w-full">
          <Link to={"/home"}>
            <BsHouse
              className="text-black cursor-pointer text-4xl"
              title="Home"
            ></BsHouse>
          </Link>

          <div
            className="flex flex-row"
            onClick={() => {
              createNewChat();
            }}
          >
            <BiEdit
              className="text-black cursor-pointer text-4xl"
              title="Create new chat"
            ></BiEdit>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {previousChats.map((chat) => {
            return (
              <div
                className="w-11/12 m-2 rounded-2xl bg-gray-200 items-center p-2 cursor-pointer hover:bg-gray-300 truncate"
                onClick={() => {
                  setMessages(chat.messages);
                }}
              >
                {chat.title}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col w-full h-screen md:w-3/6 mx-auto justify-center items-center relative py-14">
        <div className="flex flex-row items-center justify-between md:justify-end w-full absolute right-0 top-0 left-0 p-3 md:right-5 md:top-2">
          <Link to={"/home"} className="md:hidden">
            <button className="cursor-pointer" title="My profile">
              <BsHouse className="text-black text-5xl font-light"></BsHouse>
            </button>
          </Link>

          <Link to={"/profile"}>
            <button className="cursor-pointer" title="My profile">
              <PiUserCircleThin className="text-black text-5xl font-light"></PiUserCircleThin>
            </button>
          </Link>
        </div>

        <div
          className="w-full chat-inner-area relative h-full flex flex-col justify-center"
          ref={chatArea}
        >
          {messages.length == 0 && (
            <h3 className="text-4xl text-black my-10 text-center">
              Hello {name.split(" ").length > 1 ? name.split(" ")[1] : name},
              What can i help you with today?
            </h3>
          )}
          {
            <button
              className="absolute bottom-40 right-10 cursor-pointer bg-black h-10 w-10 rounded-full z-50 flex items-center justify-center"
              onClick={scrollToBottom}
            >
              <PiArrowDown className="text-white text-2xl"></PiArrowDown>
            </button>
          }
          {messages.length > 0 && (
            <div className="h-full w-full pt-7 gap-y-2 flex flex-col overflow-y-auto px-5 mb-24" ref={chatWindow}>
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
                          onClick={(e: any) => {
                            speechService?.stop();
                            speechService?.speak();
                            speechService?.stop();
                            setIsSpeaking(false);
                            setSpeechText(message.message);
                            if (currentVoice) {
                              speechService?.setVoice(currentVoice);
                            }
                            speechService?.speak();
                            setIsSpeaking(true);
                            e.target.click();
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
                      [suggestedQuestion, JSON.stringify(messages)],
                      processedMessage
                    );
                  }}
                >
                  <ReactMarkdown>{suggestedQuestion}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          className="flex flex-row w-11/12 mx-auto bg-gray-200 p-2 gap-x-2 absolute bottom-7 md:bottom-2 left-2 right-2 mb-5 md:mb-16"
          style={{ borderRadius: "45px" }}
          onSubmit={submitQuestion}
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
            className={`w-12 h-12 min-w-12 rounded-full bg-black flex items-center justify-center`}
            type="button"
            style={{ minWidth: "48px" }}
            disabled={message.length > 0 && false}
            onClick={handleListen}
          >
            <PiWaveform className="text-white text-2xl"></PiWaveform>
          </button>

          {message.length > 0 && (
            <Fade direction="left" duration={260}>
              <button
                className={`w-12 h-12 min-w-12 rounded-full bg-black flex items-center justify-center ${
                  message.length == 0 && "opacity-50 cursor-not-allowed"
                }`}
                style={{ minWidth: "48px" }}
                disabled={message.length > 0 && false}
                type="submit"
              >
                <PiArrowUpBold className="text-white text-2xl"></PiArrowUpBold>
              </button>
            </Fade>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chat;
