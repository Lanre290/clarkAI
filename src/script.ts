import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = import.meta.env.VITE_GEMINI_KEY;
export const genAI = new GoogleGenerativeAI(API_KEY);

export const reactTiltOptions = {
  reverse: false,
  max: 35,
  perspective: 2000,
  scale: 1.1,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

const suggestQuestion = async (dependencies: string[]) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result_ = await model.generateContent([
    ...dependencies,
    `You are an AI study buddy. Suggest a very understandable question your student might ask, ranging from conceptual, practical, and scenario-based questions. Do not focus solely on explanations and return only one short sentence and make sure your question differs from the original question.`,
  ]);

  const response = await result_.response;
  const aiText = await response.text();
  aiText.substring(7, aiText.length - 3);

  return aiText;
};

export default suggestQuestion;
