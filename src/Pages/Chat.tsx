import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { BiEdit } from "react-icons/bi";
import {
  PiArrowUpBold,
  PiHouseLight,
  PiUserCircleThin,
  PiWaveform,
} from "react-icons/pi";
import { Link } from "react-router-dom";
import { messageInterface } from "./UploadPdf";
import { toast } from "react-toastify";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [suggestedQuestion, setSuggestedQuestion] = useState<string>("");


  const generateAIAnswer = async (
    dependencies: string[],
    userMessage: messageInterface
  ) => {
    setSuggestedQuestion("");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result_ = await model.generateContent(dependencies);
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

      generateAIAnswer([message, pdfText], processedMessage);

      const chatElement = chatArea.current as unknown as HTMLElement;
      chatElement.scrollTop = chatElement.scrollHeight;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  
  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex flex-col h-screen w-72 overflow-y-auto bg-gray-100">
        <div className="flex flex-row my-5 px-6 items-center justify-between w-full">
          <Link
            to={"/home"}
            onProgress={() => {
              console.log("dwwddw");
            }}
          >
            <PiHouseLight
              className="text-black cursor-pointer text-4xl"
              title="Home"
            ></PiHouseLight>
          </Link>

          <div className="flex flex-row">
            <BiEdit
              className="text-black cursor-pointer text-4xl"
              title="Create new chat"
            ></BiEdit>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-3/6 lg:w-2/5 mx-auto justify-center items-center relative py-14">
        <div className="flex flex-row items-center justify-end w-full absolute right-5 top-2">
          <button className="cursor-pointer" title="My profile">
            <PiUserCircleThin className="text-black text-5xl font-light"></PiUserCircleThin>
          </button>
        </div>

        <h3 className="text-4xl text-black my-10 text-center">
          Hello Sheriff, What can i help you with today?
        </h3>

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
                    [suggestedQuestion, pdfText],
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
  );
};

export default Chat;
