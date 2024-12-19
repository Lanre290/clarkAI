import { useEffect, useState } from "react";
import ChooseOperation from "../components/ChooseOperation";
import Header from "../components/Header";
import { genAI } from "../script";
import Markdown from "react-markdown";

const Home = () => {
  const query = `You are an AI educational assistant, generate a very random educational fact from any subject, including but not limited to science, history, technology, literature, mathematics, geography, art, and philosophy. The fact should be interesting, insightful, and provide new knowledge or context. The fact should be short and engaging, suitable for sharing as a daily learning tidbit or fun trivia. Make sure the fact is accurate and comes from reliable sources, offering users something new to learn every time.`;
    const [randomFact, setRandomFact] = useState('');
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
      <div className="w-full h-full lg:w-5/6 mx-auto mt-10">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-96 rounded-br-2xl rounded-bl-2xl">
            <div className="flex flex-row justify-between w-full">
              <div className="w-20 rounded-tr-3xl rounded-tl-3xl bg-black h-12"></div>
              <div className="w-20 rounded-tr-3xl rounded-tl-3xl bg-black h-12"></div>
            </div>
            <h3 className="h-80 text-white bg-black w-full rounded-bl-3xl rounded-br-3xl flex justify-center items-center text-center">
                <Markdown>{randomFact}</Markdown>
            </h3>
          </div>
        </div>
        <ChooseOperation></ChooseOperation>
      </div>
    </>
  );
};

export default Home;
