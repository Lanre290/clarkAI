import { createContext, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import userAnimationData from './../assets/animations/userAnimation.json';
import Lottie from "react-lottie";
import { Fade } from "react-awesome-reveal";


const loadingUserOption = {
    loop: true,
    autoplay: true,
    animationData: userAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  

const Home = () => {
    const {user} = useUser();
    const navigate = useNavigate()


  const query = `Generate a unique, non-repeating educational fact from a random subject like space, biology, physics, chemistry, math, art, philosophy, literature, history, general studies, or others. Each fact should introduce fresh knowledge or context, be accurate, and not exceed 50 words. Rotate subjects frequently to ensure diversity.enerate a random educational fact ranging from philosophy to physics, math, english, general studies, history and many more for a student, providing new knowledge or context. It must be accurate and must be a different one everytime. not more than only 50 words.`;
  const [randomFact, setRandomFact] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [factCopied, setFactCopied] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const userContext = createContext(null);

  if (!userContext) {
  }

  const loadRandomFact = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result_ = await model.generateContent(query); // TO-DO: add safety setting
    const response = await result_.response;
    const aiText = await response.text();
    aiText.substring(7, aiText.length - 3);

    setRandomFact(aiText);
  };

  const loadUser = async () => {
    const token = user?.token;
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );


      if (response.ok) {
        let res = await response.json();
        const user_ = res.data;
        setName(user_.name);
        setStreakDays(user_.streak_count);
        setIsLoading(false);
      } else {
        if(!localStorage.getItem('user')){
          toast.error('Error fetching user Data. Please login again.');
          ('/login');
        }
        else{
          let user__ = JSON.parse(localStorage.getItem('user') as string);
          setName(user__.user.name);
          setStreakDays(user__.user.streak_count);
          setIsLoading(false);
        }
      }
  }

  useEffect(() => {
    if(!isAppLoaded){
        loadRandomFact();
        loadUser();
        setIsAppLoaded(true);
    }
  }, []);


  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>

      {isLoading && (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center flex-col z-50">
          <Lottie options={loadingUserOption} height={screen.width < 768 ? 300 : 400} width={screen.width < 768 ? 300 : 400} />
          <Fade direction="up" delay={1000} duration={1200}>
            <h3 className="text-white text-4xl text-center">
              Getting user data
            </h3>
          </Fade>
        </div>
      )}
      <div className="w-full h-full lg:w-5/6 mx-auto mt-10 overflow-y-auto">
        <h3 className="text-black text-3xl md:text-6xl ml-5 my-7">Hello {name.split(" ").length > 1 ? name.split(" ")[1] : name} !</h3>
        <div className="flex flex-col md:flex-row justify-center items-start md:justify-evenly md:items-end">
          <div className="flex flex-col w-full mx-auto md:mx-0 md:w-96 rounded-br-2xl rounded-bl-2xl relative p-2">
            <img
              src={ideaImage}
              alt=""
              className="w-10 h-10 md:w-14 md:h-14 object-cover absolute top-6 right-7 md:top-16 md:right-7"
            />
            <button
              className="absolute top-6 left-7 md:top-16 md:left-7 text-white cursor-pointer"
              title={factCopied == true ? "Copied" : "Copy to clipboard"}
              onClick={() => {
                navigator.clipboard.writeText(randomFact);
                toast.info("Fact copied to clipboard.");
                setFactCopied(true);
                setTimeout(() => {
                  setFactCopied(false);
                }, 2000);
              }}
            >
              {factCopied == false ? (
                <PiCopy className="text-white text-4xl md:text-6xl"></PiCopy>
              ) : (
                <PiCheck className="text-white text-4xl md:text-6xl"></PiCheck>
              )}
            </button>
            <div className="flex flex-row justify-between w-full">
              <div className="w-20 rounded-tr-3xl rounded-tl-3xl bg-black h-12"></div>
              <div className="w-20 rounded-tr-3xl rounded-tl-3xl bg-black h-12"></div>
            </div>
            <h3 className="h-64 md:h-80 text-white bg-black w-full rounded-bl-3xl rounded-br-3xl flex justify-center items-center text-center p-3">
              <ReactMarkdown>{randomFact}</ReactMarkdown>

              {/* loading for when fact is yet to be generated */}
              {randomFact.trim().length == 0 && (
                <Loading small={false}></Loading>
              )}
            </h3>
          </div>

          <div className="flex tilt-cont w-96 mx-auto md:mx-0 px-0">
          <Tilt option={reactTiltOptions}>
            <div className="flex flex-col w-full mx-3 md:mx-0 md:w-96 rounded-br-2xl rounded-bl-2xl relative">
              <img
                src={streakImage}
                alt=""
                className="h-10 md:w-14 w-10 md:h-14 object-cover absolute right-5 top-6 md:right-10"
              />
              <h3 className="h-80 text-white bg-blue-300 w-full rounded-3xl flex flex-col justify-center items-center text-center text-2xl">
                <h3 className="text-6xl text-white">{streakDays}</h3>
                <br />
                Days learning streak
              </h3>
            </div>
          </Tilt>
          </div>
        </div>
        <ChooseOperation></ChooseOperation>
      </div>
    </>
  );
};

export default Home;
