import {
  PiArrowLeft,
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
import { useUser } from "../context/UserContext";
import { BsHouse } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { jsPDF } from "jspdf";
import { BiCopy, BiPause, BiPlay, BiStop, BiVolumeFull } from "react-icons/bi";
import Listening from "../components/Listening";
import { geminiModel } from "../App";
import Loading from "../components/Loading";

export interface messageInterface {
  src?: string;
  video?: boolean;
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

interface quizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface quizResult {
  correct_questions: number;
  questions: {
    question_number: number;
    question: string;
    options: string[];
    chosen_answer: string;
    correct_answer: string;
    correct: boolean;
    explanation: string;
    correct_questions: number;
  }[]
}

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
  const [quizSettingUI, setQuizSettingUI] = useState(false);
  const [quizDuration, setQuizDuration] = useState<any>(null);
  const [numberOfQuizQuestions, setNumberOfQuizQuestions] = useState("");
  const [quizUi, setQuizUI] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<quizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [generatingQuiz, setGeneratingQuiz] = useState<boolean>(false);
  const [quizExplanationUI, setQuizExplanationUI] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<quizResult>([] as any);
  const [pdfContent, setPDFContent] = useState('');

  const submitMessageButton = useRef<null | HTMLButtonElement>(null);
  const readButton = useRef<null | HTMLButtonElement>(null);

  const SpeechRecognition = new ((window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition)();

  const { user, setUser } = useUser();
  let time:any;

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
        const model = genAI.getGenerativeModel({ model: geminiModel });
        const result_ = await model.generateContent([queryText, text]);
        const response = await result_.response;
        const aiText = await response.text();
        aiText.substring(7, aiText.length - 3);
        setResult(aiText);
        setPDFText(aiText);
        setPDFContent(text);
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
      toast.error("Please upload a valid PDF file");
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
    const model = genAI.getGenerativeModel({ model: geminiModel });
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

    const content: HTMLElement =
      pdfHTMLElement.current as unknown as HTMLElement;

    const contentWidth = content.offsetWidth - 20;
    const contentHeight = content.offsetHeight;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const scale = Math.min(
      pageWidth / contentWidth,
      pageHeight / contentHeight
    );

    doc.html(content, {
      callback: () => {
        // Set font size before saving or adding more text
        doc.setFontSize(12); // Adjust this size as needed
        doc.save(`${filename}_${pdfMode}.pdf`);
      },
      margin: [10, 10, 10, 10],
      html2canvas: {
        scale,
      },
    });
  };

  const submitPDFQuestion = async (e?: React.FormEvent) => {
    try {
      (e as any).preventDefault();
    } catch (error) {}

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


  const createQuiz = async () => {
    try {
      setGeneratingQuiz(true);
      if (!numberOfQuizQuestions) {
        toast.error("Select a valid number of quiz questions.");
        throw new Error("b");
      }

      if (!quizDuration) {
        toast.error("Select a valid quiz duration.");
        throw new Error("b");
      }

      const model = genAI.getGenerativeModel({ model: geminiModel });
      const result_ = await model.generateContent([
        pdfContent,
        `
        You are an AI teacher. Generate exactly ${numberOfQuizQuestions} technical multiple-choice questions from this PDF,
        Each question must have Four distinct options,
        One correct answer.
        A short explanation for the correct answer. Response should be in the format: "questions": [
        {
        "question": "Which data types are supported by Fortran 90?",
        "options": ["Integer", "Real", "Logical", "Character"],
        "correct_answer": "Integer, Real, Logical, Character",
        "explanation": ""
        },
        {
        "question": "Which of the following is a valid data type in Fortran 90?",
        "options": ["Float", "Integer", "String", "Boolean"],
        "correct_answer": "Integer",
        "explanation": ""
        },
        {
        "question": "How many data types are mentioned in the Fortran 90 overview?",
        "options": ["Four", "Five", "Six", "Three"],
        "correct_answer": "Four",
        "explanation": ""
        }
        ]
        Make questions specific, technical, and derived directly from the document.
        `,
      ]);

      const response = await result_.response;
      let text_ = await response.text();
      text_ = text_.slice(7, text_.length - 4).trim();

      console.log(text_);
      console.log('start: ', text_[0]);
      const aiText = text_.startsWith("{") ? text_ : `{${text_}}`;

      console.log(aiText);
      const questions_ = JSON.parse(aiText);
      console.log(JSON.parse(aiText));
      setQuizQuestions(questions_.questions);
      console.log(quizQuestions);
      setQuizUI(true);
      setGeneratingQuiz(false);

      let time = parseInt(quizDuration);

      setInterval(() => {
        time = time - 1;
        setQuizDuration(time);
        setQuizDuration(time);
      }, 1000);

    } catch (error: any) {
      if (error.message != "b") {
        setGeneratingQuiz(false);
        console.error(error);
        toast.error("Error generating quiz. please try again.");
      }
    }
  };

  const chooseAnswer = (index: number) => {
    let answers = userAnswers;
    answers[currentQuestion] = quizQuestions[currentQuestion].options[index];

    console.log('reflected.');
  };

  const submitQuiz = () => {
    let result: any = {};
    const array: any[] = [];
    let correctQuestions = 0;
    quizQuestions.forEach((question, index) => {
      let object = {
        question_number: index + 1,
        question: question.correct_answer,
        options: question.options,
        chosen_answer: userAnswers[index],
        correct_answer: question.correct_answer,
        correct: question.correct_answer == userAnswers[index],
        explanation: question.explanation,
      };


      if(object.correct){
        correctQuestions++
      }
      array.push(object);
    });

    result.questions = array
    result.correct_questions = correctQuestions;

    console.log(array);
    setQuizResult(result);
    setQuizExplanationUI(true);
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      submitPDFQuestion();
    }, 300);
  }, [speechToTextResponse]);

  useEffect(() => {
    time = quizDuration;

  }, [quizDuration]);

  const optionLetters = ["A", "B", "C", "D"];

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

      {quizSettingUI && (
        <div
          className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center flex-col"
          style={{ zIndex: 100 }}
        >
          <div className="w-full h-full md:h-auto bg-white md:rounded-3xl flex flex-col md:justify-center items-center pt-5 md:pt-0 gap-y-10 md:gap-y-0 p-6 md:w-96 xl:w-96">
            {screen.width > 768 ? (
              <div className="flex flex-row justify-end w-11/12 mt-5">
                <button
                  className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setQuizSettingUI(false);
                  }}
                >
                  <CgClose className="text-blacl text-2xl"></CgClose>
                </button>
              </div>
            ) : (
              <div className="flex w-full justify-start mt-5">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setQuizSettingUI(false);
                  }}
                >
                  <PiArrowLeft className="text-blacl text-xl"></PiArrowLeft>
                </button>
              </div>
            )}

            <div className="w-full flex flex-col justify-start items-center gap-y-10">
              <h3 className="text-black text-2xl md:text-4xl text-center">
                Prepare your quiz
              </h3>
              <div className="w-full flex flex-col gap-y-6 items-center justify-center">
                <select
                  onInput={(e: any) => {
                    setQuizDuration(e.target.value);
                  }}
                  className="border-2 border-black cursor-pointer px-7 py-3 rounded-2xl w-11/12 md:w-64"
                >
                  <option value="">Duration of quiz</option>
                  <option value="300">5 Minutes</option>
                  <option value="600">10 Minutes</option>
                  <option value="900">15 Minutes</option>
                  <option value="1800">30 Minutes</option>
                  <option value="3600">1 hour</option>
                </select>
                <select
                  onInput={(e: any) => {
                    setNumberOfQuizQuestions(e.target.value);
                  }}
                  className="border-2 border-black cursor-pointer px-7 py-3 rounded-2xl w-11/12 md:w-64"
                >
                  <option value="">Number of questions</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                  <option value="35">35</option>
                  <option value="40">40</option>
                  <option value="45">45</option>
                  <option value="50">50</option>
                  <option value="55">55</option>
                  <option value="60">60</option>
                </select>
              </div>

              <button
                className={`flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl md:mx-0 mx-auto my-1 bg-black text-white ${
                  generatingQuiz
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                } rounded-2xl w-11/12 md:w-64`}
                onClick={createQuiz}
                title={
                  generatingQuiz ? "Creating your quiz" : "Click to proceed."
                }
              >
                {generatingQuiz ? <Loading small></Loading> : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}

      {quizUi && (
        <div
          className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-90 flex items-center justify-center flex-col"
          style={{ zIndex: 100, backdropFilter: "blur(3px)" }}
        >
          <div className="w-full h-full md:h-auto flex flex-col gap-y-5 md:gap-y-10 bg-white md:w-2/3 xl:w-1/2 md:rounded-3xl shadow-2xl justify-between md:justify-center items-center p-6 md:p-10">
            <h3 className="text-black text-3xl text-start mt-12 md:mt-0">
              {Math.floor(quizDuration / 3600)}:{Math.floor(quizDuration / 60) < 10 ? '0' : ''}{Math.floor(quizDuration / 60)}:
              {quizDuration % 60 < 10 ? '0' : ''}{quizDuration % 60}
            </h3>

            <div className="flex flex-col w-full md:justify-center flex-grow">
              <h3 className="text-black text-xl md:text-3xl">
                {currentQuestion + 1}.&nbsp;
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="flex flex-col gap-y-3 mt-7">
                <div className="flex flex-row gap-x-3">
                  <input
                    type="radio"
                    name="quiz_options"
                    value={quizQuestions[currentQuestion].options[0]}
                    id="option1"
                    className="w-6 h-6 cursor-pointer"
                    onClick={(e: any) => {
                      e.target.checked = true;
                      chooseAnswer(0);
                    }}
                    checked={
                      (userAnswers[currentQuestion] !== undefined &&
                        userAnswers[currentQuestion] ==
                          quizQuestions[currentQuestion].options[0]) as boolean
                    }
                  />
                  <label className="text-xl md:text-2xl" htmlFor="option1">
                    {quizQuestions[currentQuestion].options[0]}
                  </label>
                </div>
                <div className="flex flex-row gap-x-3">
                  <input
                    type="radio"
                    name="quiz_options"
                    value={quizQuestions[currentQuestion].options[1]}
                    id="option2"
                    className="w-6 h-6 cursor-pointer"
                    onClick={(e: any) => {
                      e.target.checked = true;
                      chooseAnswer(1);
                    }}
                    checked={
                      (userAnswers[currentQuestion] !== undefined &&
                        userAnswers[currentQuestion] ==
                          quizQuestions[currentQuestion].options[1]) as boolean
                    }
                  />
                  <label className="text-xl md:text-2xl" htmlFor="option2">
                    {quizQuestions[currentQuestion].options[1]}
                  </label>
                </div>
                <div className="flex flex-row gap-x-3">
                  <input
                    type="radio"
                    name="quiz_options"
                    value={quizQuestions[currentQuestion].options[2]}
                    id="option3"
                    className="w-6 h-6 cursor-pointer"
                    onClick={(e: any) => {
                      e.target.checked = true;
                      chooseAnswer(2);
                    }}
                    checked={
                      (userAnswers[currentQuestion] !== undefined &&
                        userAnswers[currentQuestion] ==
                          quizQuestions[currentQuestion].options[2]) as boolean
                    }
                  />
                  <label className="text-xl md:text-2xl" htmlFor="option3">
                    {quizQuestions[currentQuestion].options[2]}
                  </label>
                </div>
                <div className="flex flex-row gap-x-3">
                  <input
                    type="radio"
                    name="quiz_options"
                    value={quizQuestions[currentQuestion].options[3]}
                    id="option4"
                    className="w-6 h-6 cursor-pointer"
                    onClick={(e: any) => {
                      e.target.checked = true;
                      chooseAnswer(3);
                    }}
                    checked={
                      (userAnswers[currentQuestion] !== undefined &&
                        userAnswers[currentQuestion] ==
                          quizQuestions[currentQuestion].options[3]) as boolean
                    }
                  />
                  <label className="text-xl md:text-2xl" htmlFor="option4">
                    {quizQuestions[currentQuestion].options[3]}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full">
                <div className="flex flex-row flex-wrap gap-2">
                  {
                    quizQuestions.map((question, index) => {
                      return(
                        <div className={`w-10 h-10 flex items-center justify-center border ${currentQuestion == index ? 'text-white bg-black' : 'text-black hover:bg-gray-100 hover:text-black'} ${userAnswers[index] !== undefined && 'bg-green-600 border-green-600 text-white'} border-black cursor-pointer`} onClick={() => {setCurrentQuestion(index)}}>
                          {index+1}
                        </div>
                      )
                    })
                  }
                </div>
                <div className="flex flex-col md:flex-row md:justify-between mt-10">
                  <button
                    className="flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl md:mx-0 mx-auto my-1 bg-white text-black border border-black rounded-2xl w-11/12 md:w-64 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      if (currentQuestion != 0) {
                        setCurrentQuestion(currentQuestion - 1);
                      }
                    }}
                  >
                    Previous Question
                  </button>

                  <button
                    className="flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl md:mx-0 mx-auto my-1 bg-white text-black border border-black rounded-2xl w-11/12 md:w-64 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      if (currentQuestion != quizQuestions.length - 1) {
                        setCurrentQuestion(currentQuestion + 1);
                      }
                    }}
                  >
                    Next Question
                  </button>
                </div>
              </div>

              <div className="flex flex-row md:justify-end mt-10">
                <button
                  className="flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl md:mx-0 mx-auto my-1 bg-black text-white rounded-2xl w-11/12 md:w-64 cursor-pointer"
                  onClick={submitQuiz}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quizExplanationUI && (
        <div
          className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center flex-col"
          style={{ zIndex: 100 }}
        >
          <div className="w-full h-full md:h-auto bg-white md:rounded-3xl flex flex-col items-center pt-5 md:pt-0 gap-y-10 md:gap-y-0 p-6 xl:w-2/3 overflow-y-auto">
            <div className="w-full flex flex-col justify-start items-center gap-y-10 mt-10">
              <h3 className="text-black text-2xl md:text-4xl text-start w-full">
                Correct questions: {quizResult.correct_questions}/{(quizResult as any).questions.length}
              </h3>
              <div className="w-full flex flex-col gap-y-6 items-center justify-center">
                {quizResult.questions.map((question) => {
                  return (
                    <div className="w-full flex flex-col overflow-y-auto">
                      <h3 className="text-black text-xl md:text-3xl">
                        {question.question_number}.&nbsp;
                        {quizQuestions[currentQuestion].question}
                      </h3>

                      {question.options.map((option, index) => {
                        return (
                          <h3 className="text-black text-xl md:text-3xl">
                            {optionLetters[index]}.&nbsp;{option}
                          </h3>
                        );
                      })}

                      <div
                        className={`mt-5 w-36 text-center py-3 px-7 ${
                          question.correct
                            ? "bg-green-200 text-green-600"
                            : "bg-red-200 text-red-600"
                        }`}
                      >
                        {question.correct ? "CORRECT." : "FAILED."}
                      </div>
                      <h3 className="text-black w-full text-start">
                        Correct Answer: {question.correct_answer}
                      </h3>
                      <h3 className="text-black w-full text-start">
                        You chose: {question.chosen_answer}
                      </h3>
                      <h3 className="text-black w-full text-start mt-5 break-words overflow-hidden">
                        Explanation: {question.explanation}
                      </h3>
                    </div>
                  );
                })}
              </div>

              <button
                className={`flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl md:mx-0 mx-auto my-1 bg-black text-white cursor-pointer rounded-2xl w-11/12 md:w-64`}
                onClick={() => {
                  setQuizExplanationUI(false);
                  setQuizUI(false);
                  setQuizSettingUI(false);
                  setUserAnswers([]);
                  setQuizQuestions([]);
                  setCurrentQuestion(0);
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full md:mt-20 flex md:flex-row">
        <div
          className="md:w-2/3 lg:w-4/6 w-full h-full overflow-y-auto pt-14 md:pt-7"
          style={{ height: screen.width > 768 ? divHeight : "100vh" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-start w-full mt-7 md:ml-10 gap-x-3 gap-y-2">
            <div className="flex flex-row items-center justify-start w-full md:w-min">
              <a href={"/home"} className="p-4 cursor-pointer">
                <BsHouse className="text-black text-5xl"></BsHouse>
              </a>
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

            <h3 className="text-black text-3xl h-full flex items-center justify-start md:w-1/2 truncate w-full text-start px-3">
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

            <button
              className={`bg-black text-white rounded-3xl ${
                pdfFile == null
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl w-11/12 md:w-auto md:mx-0 mx-auto my-1`}
              title={pdfFile == null ? "Upload a pdf file" : "Generate a quiz"}
              disabled={pdfFile == null}
              onClick={() => {
                setQuizSettingUI(true);
              }}
            >
              Generate Quiz
            </button>
          </div>

          <div className="p-5 text-xl pb-28" ref={pdfHTMLElement}>
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
                  Hello{" "}
                  {name &&
                    (name.split(" ").length > 1 ? name.split(" ")[1] : name)}
                  , Ask me any question about your pdf.
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
                                setIsSpeaking(false);
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
