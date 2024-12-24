import { useEffect, useRef, useState } from "react";
import { PiCrownBold, PiRobotThin, PiUserCircleThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const Header = () => {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(true);
  const googleElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleTranslate = () => {
      console.log("Initializing Google Translate...");
      if (googleElement.current) {
        googleElement.current.innerHTML = "";
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "es,fr,de,it,pt,zh,ja,ko,ar,ru,hi,sw",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          googleElement.current
        );
      }
    };
  
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onload = () => {
      console.log("Google Translate script loaded.");
      if (window.google && window.google.translate) {
        initializeGoogleTranslate();
      } else {
        window.googleTranslateElementInit = initializeGoogleTranslate;
      }
    };
  
    script.onerror = () => console.error("Failed to load Google Translate script.");
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsPremium(
      user?.user.is_premium ||
        (storedUser && JSON.parse(storedUser)?.user?.is_premium) ||
        false
    );
  }, [user]);

  return (
    <div className="w-full h-full flex flex-row justify-between shadow-xl" style={{ zIndex: 100 }}>
      <div className="flex flex-row items-center justify-center">
        <div className="text-black font-light text-2xl items-center justify-center m-4 flex flex-row">
          <PiRobotThin className="text-5xl"></PiRobotThin>
          <h3 className="font-light text-black text-5xl logo-text">Clark</h3>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center mr-2 md:mr-16 gap-x-3">
        <div ref={googleElement}></div>
        {isPremium ? (
          <button className="bg-transparent text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl border border-gold">
            <PiCrownBold className="text-2xl gold"></PiCrownBold>
            <h3 className="hidden md:flex gold">premium</h3>
          </button>
        ) : (
          <button className="bg-black text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl">
            <PiCrownBold className="text-2xl"></PiCrownBold>
            <h3 className="hidden md:flex">Go premium</h3>
          </button>
        )}
        <Link to={"/profile"}>
          <button className="cursor-pointer" title="My profile">
            <PiUserCircleThin className="text-black text-5xl font-light"></PiUserCircleThin>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
