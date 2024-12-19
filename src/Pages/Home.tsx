import { useEffect, useState } from "react";
import ChooseOperation from "../components/ChooseOperation";
import Header from "../components/Header";
import { genAI, reactTiltOptions } from "../script";
import ideaImage from "./../assets/images/idea.png";
import streakImage from "./../assets/images/fire.png";
import { PiCheck, PiCopy } from "react-icons/pi";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { Tilt } from "react-tilt";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

const Home = () => {
  const query = `Generate a random educational fact ranging from philosophy to physics, math, english, general studies, history and many more for a student, providing new knowledge or context. It must be accurate and must be a different one everytime. not more than only 50 words.`;
  const [randomFact, setRandomFact] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [factCopied, setFactCopied] = useState(false);

  const loadRandomFact = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result_ = await model.generateContent(query); // TO-DO: add safety setting
    const response = await result_.response;
    const aiText = await response.text();
    aiText.substring(7, aiText.length - 3);

    setRandomFact(aiText);
  };

  useEffect(() => {
    loadRandomFact();
  }, []);
  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <div className="w-full h-full lg:w-5/6 mx-auto mt-10">
        <div className="flex flex-row justify-evenly items-end">
          <div className="flex flex-col w-96 rounded-br-2xl rounded-bl-2xl relative p-2">
            <img
              src={ideaImage}
              alt=""
              className="w-14 h-14 object-cover absolute top-16 right-7"
            />
            <button
              className="absolute top-16 left-7 text-white cursor-pointer"
              title={factCopied == true ? "Copied" : "Copy to clipboard"}
              onClick={() => {
                navigator.clipboard.writeText(randomFact);
                toast.info("Fact cpoied to clipboard.");
                setFactCopied(true);
                setTimeout(() => {
                  setFactCopied(false);
                }, 2000);
              }}
            >
              {factCopied == false ? (
                <PiCopy className="text-white text-6xl"></PiCopy>
              ) : (
                <PiCheck className="text-white text-6xl"></PiCheck>
              )}
            </button>
            <div className="flex flex-row justify-between w-full">
              <div className="w-20 rounded-tr-3xl rounded-tl-3xl bg-black h-12"></div>
              <div className="w-20 rounded-tr-3xl rounded-tl-3xl bg-black h-12"></div>
            </div>
            <h3 className="h-80 text-white bg-black w-full rounded-bl-3xl rounded-br-3xl flex justify-center items-center text-center p-3">
              <ReactMarkdown>{randomFact}</ReactMarkdown>

              {/* loading for when fact is yet to be generated */}
              {randomFact.trim().length == 0 && (
                <Loading></Loading>
              )}
            </h3>
          </div>

          <Tilt option={reactTiltOptions}>
            <div className="flex flex-col w-96 rounded-br-2xl rounded-bl-2xl relative">
              <img
                src={streakImage}
                alt=""
                className="w-14 h-1w-14 object-cover absolute top-10 right-10"
              />
              <h3 className="h-80 text-white bg-blue-300 w-full rounded-3xl flex flex-col justify-center items-center text-center text-2xl">
                <h3 className="text-6xl text-white">{streakDays}</h3>
                <br />
                Days learning streak
              </h3>
            </div>
          </Tilt>
        </div>
        <ChooseOperation></ChooseOperation>
      </div>
    </>
  );
};

export default Home;
