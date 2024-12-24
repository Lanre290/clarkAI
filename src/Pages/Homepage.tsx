import { Fade } from "react-awesome-reveal";
import { PiArrowRight } from "react-icons/pi";
import { Link } from "react-router-dom";
import rocket from './../assets/images/rocket.png';
import app from './../assets/images/app.png';

const HomePage = () => {
  const typeString = `Effortlessly upload your course PDFs to Clark and let the AI scan and analyze your materials. Get AI-powered summaries, answers to your questions, voice output for explanations, and voice input for seamless interaction. Plus, with support for multiple languages, Clark serves as your personalized, multilingual AI-powered student assistant.`;

  return (
    <div className="w-screen flex flex-col">
      <div className="w-full h-screen bg-center bg-cover relative home-bg">
        <img src={rocket} alt="rocket" className="w-28 h-28 rocket-img absolute left-28 bottom-80" />
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-70 flex flex-col items-center gap-y-5">
          <div className="flex flex-row w-full justify-evenly items-center my-10">
            <h3 className="text-white text-4xl">Clark</h3>

            <div className="flex flex-row">
                <a href="#features" className="text-white cursor-pointer text-3xl">Features</a>
            </div>

            <Link to={"/signup"}>
              <button className="w-44 rounded-3xl cursor-pointer flex items-center justify-center text-2xl shadow-2xl bg-white h-12">
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
                <button className="w-56 rounded-3xl cursor-pointer flex items-center justify-center text-2xl shadow-2xl bg-white h-12 mt-16">
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

            <img src={app} alt="app image" className="w-11/12 md:w-2/4 rounded-3xl shadow-2xl object-cover p-5" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
