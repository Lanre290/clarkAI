import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-toastify";
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

export const suggestQuestion = async (dependencies: string[]) => {
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

interface SpeechSynthesisControls {
  speak: () => void;
  pause: () => void;
  play: () => void;
  stop: () => void;
  getVoices: () => SpeechSynthesisVoice[];
  setVoice: (voiceName: string) => void;
  isSpeaking:() => boolean;
}

export class SpeechSynthesisService implements SpeechSynthesisControls {
  public utterance: SpeechSynthesisUtterance;

  constructor(text: string) {
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported in this browser.');
      throw new Error('Speech synthesis not supported');
    }


    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.pitch = 1.1;
    this.utterance.rate = 0.9; 

    
  }

  speak = () => {
    speechSynthesis.speak(this.utterance);
    if(!speechSynthesis.speaking){
      speechSynthesis.speak(this.utterance);
    }
  };

  pause = () => {
    speechSynthesis.pause();
  };

  play = () => {
    speechSynthesis.resume();
  };

  stop = () => {
    speechSynthesis.cancel();
  };

  getVoices = () => {
    return speechSynthesis.getVoices();
  };

  isSpeaking = () => {
    return speechSynthesis.speaking;
  }

  setVoice = (voiceName: string) => {
    const voices = this.getVoices();
    const selectedVoice = voices.find((voice) => voice.name === voiceName);
    if (selectedVoice) {
      speechSynthesis.cancel();
  
      this.utterance.voice = selectedVoice;
      speechSynthesis.speak(this.utterance);
    } else {
      toast.error(`Voice "${voiceName}" not found.`);
    }
  };
  
}


let test = new SpeechSynthesisService('');
test.speak();
test.speak();
test.speak();