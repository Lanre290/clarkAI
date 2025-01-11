import { Fade } from "react-awesome-reveal";
import { PiArrowRight, PiRobotThin } from "react-icons/pi";
import rocket from "./../assets/images/rocket.png";
import app from "./../assets/images/app.png";
import HomepageTitle from "../components/HompageTitle";
import FeatureTile from "../components/FeatureTile";
import {
  BsJustifyLeft,
  BsPencil,
  BsRobot,
  BsTranslate,
  BsTrophy,
  BsUpcScan,
  BsUpload,
} from "react-icons/bs";
import { BiLinkExternal, BiTrim } from "react-icons/bi";
import Faq from "react-faq-component";
import { Link } from "react-router-dom";

const HomePage = () => {
  const faqData = {
    title: "Frequently Asked Questions.",
    rows: [
      {
        title: "What types of files are accepted on ClarkAI?",
        content: "You can upload PDF Files and share YouTube links to the AI.",
      },
      {
        title: "How does ClarkAI work?",
        content:
          "Clark AI uses advanced AI algorithms to break down complex topics into simpler lessons. You can upload study materials or specify topics, and the AI will guide you step by step, like a personal tutor available 24/7!",
      },
      {
        title: "What subjects can I learn with ClarkAI?",
        content:
          "ClarkAI supports learning a wide range of subjects, including math, science, programming, history, and even languages. It’s versatile for academic and non-academic topics.",
      },
      {
        title: "Are there usage limits?",
        content:
          "No, ClarkAI has no daily limits on usage. Learn as much as you want!",
      },
      {
        title: "Can ClarkAI help me prepare for exams?",
        content:
          "Yes, ClarkAI simplifies topics, highlights key areas, and provides detailed explanations to help you prepare effectively.",
      },
      {
        title: "How secure is the data I upload to ClarkAI?",
        content:
          "ClarkAI takes user privacy seriously and ensures all uploaded files are securely processed and stored.",
      },
    ],
  };

  const typeString = `Effortlessly upload your course PDFs to Clark and let the AI scan and analyze your materials. Get AI-powered summaries, answers to your questions, voice output for explanations, and voice input for seamless interaction. Plus, with support for multiple languages, Clark serves as your personalized, multilingual AI-powered student assistant.`;

  return (
    <div className="w-screen flex flex-col">
      <div className="w-full h-screen bg-center bg-cover relative home-bg">
        <img
          src={rocket}
          alt="rocket"
          className="w-28 h-28 rocket-img absolute left-28 bottom-80"
        />
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-70 flex flex-col items-center gap-y-5">
          <div className="flex flex-row w-full justify-evenly items-center my-10">
            <h3 className="text-white text-4xl">Clark</h3>

            <div className="flex-row hidden md:flex">
              <a
                href="#features"
                className="text-white cursor-pointer text-3xl hover:underline mx-5"
              >
                Features
              </a>
              <a
                href="#faq"
                className="text-white cursor-pointer text-3xl hover:underline mx-5"
              >
                FAQ
              </a>
            </div>

            <Link to={"/signup"}>
              <button className="w-44 rounded-3xl cursor-pointer flex items-center justify-center text-2xl shadow-2xl bg-white h-12 gap-x-3">
              <BiLinkExternal className="text-black"></BiLinkExternal>
                Get started
              </button>
            </Link>
          </div>

          <div className="flex flex-col md:mt-44 mx-auto items-center justify-center gap-y-5 flex-grow">
            <Fade direction="up" delay={500} duration={300}>
              <h3 className="text-white text-6xl">ClarkAI</h3>
            </Fade>

            <Fade direction="up" delay={1500}>
              <h3 className="text-white p-2 md:text-xl text-center w-full mx-2 md:mx-auto md:w-1/2">
                {typeString}
              </h3>
            </Fade>

            <Fade direction="left" delay={2000}>
              <Link to={"/signup"}>
                <button className="w-56 rounded-3xl cursor-pointer flex items-center justify-center text-2xl shadow-2xl bg-white h-12 mt-16 gap-x-3">
                  Get started
                  <PiArrowRight className="text-black"></PiArrowRight>
                </button>
              </Link>
            </Fade>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col py-20">
        <div className="w-full flex flex-col justify-center items-center gap-y-5">
          <h3 className="text-black text-3xl text-center">
            Great for Studying, Helping with Homework, or Research
          </h3>

          <img
            src={app}
            alt="app image"
            className="w-11/12 md:w-2/4 rounded-3xl shadow-2xl object-cover p-5"
          />
        </div>
      </div>

      <div id="features" className="flex flex-col w-full md:w-2/3 xl:w-3/5 gap-y-10 mx-auto">
        <HomepageTitle text="Features"></HomepageTitle>
        <Fade direction="up" delay={350} duration={500}>
          <h3 className="text-black text-2xl text-center">
            Clark is a user-friendly learning platform with{" "}
            <b>AI-powered tools</b>.&nbsp;
            <b>Customize your learning</b>&nbsp; with PDF analysis, AI Q&A,
            one-on-one AI chat, math equation solvers, and AI-generated quizzes.
            &nbsp;<b>Succeed in school</b>&nbsp; with Clark!
          </h3>
        </Fade>

        <div className="w-full mt-10 flex flex-wrap flex-row justify-center gap-4">
          <FeatureTile
            icon={
              <BsJustifyLeft className="text-4xl text-white"></BsJustifyLeft>
            }
            heading="AI Summaries."
            body="Get straight to the point quickly with AI generated notes and summaries."
          ></FeatureTile>

          <FeatureTile
            icon={<BsPencil className="text-4xl text-white"></BsPencil>}
            heading="Get detailed notes."
            body="Instantly create accurate notes and  from any PDF documents or a YouTube video."
          ></FeatureTile>

          <FeatureTile
            icon={<BsUpload className="text-4xl text-white"></BsUpload>}
            heading="Upload study materials."
            body="Upload and analyze your PDF documents with AI-powered insights to enhance your understanding."
          ></FeatureTile>

          <FeatureTile
            icon={<BsTranslate className="text-4xl text-white"></BsTranslate>}
            heading="Multi-lingual support."
            body="Translate your materials into study guides in your native language for easier comprehension."
          ></FeatureTile>

          <FeatureTile
            icon={<BsUpcScan className="text-4xl text-white"></BsUpcScan>}
            heading="AI Image Scanner."
            body="Effortlessly scan your notes and documents. Get instant answers to questions within your images and analyze your study materials with ease."
          ></FeatureTile>

          <FeatureTile
            icon={<BsRobot className="text-4xl text-white"></BsRobot>}
            heading="AI Study buddy."
            body="Unlock your knowledge. Instantly access facts from your uploaded notes and documents. Spend less time searching and more time learning."
          ></FeatureTile>

          <FeatureTile
            icon={<BsTrophy className="text-4xl text-white" />}
            heading="Study Streak Tracker"
            body="Maintain your study momentum! Track your daily study sessions and build impressive streaks.  Stay motivated and see your progress visually."
          />

          <FeatureTile
            icon={<BiTrim className="text-4xl text-white"></BiTrim>}
            heading="And more!!!"
            body="Discover all the benefits of Mindgrasp AI through our free trial."
          ></FeatureTile>
        </div>
      </div>


      <Link to={"/signup"}>
              <button className="w-44 rounded-3xl cursor-pointer flex items-center justify-center text-2xl shadow-2xl bg-black text-white h-12 gap-x-3 mx-auto mt-20 shadow-2xl">
                <BiLinkExternal className="text-white"></BiLinkExternal>
                Join Us
              </button>
            </Link>

      <div className="w-ful mt-24 relative bg-center bg-cover home-bg" id="faq">
        <div className="top-0 bottom-0 flex flex-col md:flex-row  py-10 px-5 left-0 right-0 bg-black bg-opacity-70" style={{backdropFilter: 'blur(3px)'}}>
        <div className="w-full lg:w-2/3 xl:w-1/2">
          <Faq data={faqData} />
        </div>

        <div className="flex flex-col justify-center items-center w-full lg:w-1/3 xl:w-1/2 gap-y-5">
          <div className="text-black font-light text-2xl items-center justify-center m-4 flex flex-row">
            <PiRobotThin className="text-5xl text-white"></PiRobotThin>
            <h3 className="font-light text-white text-5xl logo-text">
              Clark
            </h3>
          </div>

          <h3 className="text-center text-white my-5">
            Made with 💝 by Team Clark
          </h3>
          <h3 className="text-center text-white">
          © Copyright 2024 ClarkAI, Inc . All Rights Reserved
          </h3>

          <Link to={"/signup"}>
              <button className="w-44 rounded-3xl cursor-pointer flex items-center justify-center text-2xl shadow-2xl bg-white h-12 gap-x-3">
                <BiLinkExternal className="text-black"></BiLinkExternal>
                Join Us
              </button>
            </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
