import { useEffect, useRef, useState } from "react";
import { PiCrownBold, PiRobotThin, PiUserCircleThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(true);
  const translateRef = useRef<HTMLDivElement>(null);
  const [headerTopMargin, setHeaderTopMargin] = useState("0px");
  const headerElement = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "hi", name: "Hindi" },
    { code: "sw", name: "Swahili" },
    { code: "yo", name: "Yoruba" },
    { code: "ha", name: "Hausa" },
    { code: "ig", name: "Igbo" }, 
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") as string);
    setIsPremium(
      (user as any)?.is_premium ??
        (storedUser ? storedUser?.user?.is_premium : false) ??
        false
    );
  }, [user]);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      try {
        const script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
  
        // Add error event listener
        script.onerror = (error) => {
          console.error("Google Translate script failed to load:", error);
        };
  
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error adding Google Translate script:", error);
      }
    };
  5
    const initGoogleTranslate = () => {
      try {
        (window as any).googleTranslateElementInit = () => {
          if (translateRef.current) {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: "en", // Default language
                includedLanguages: languages.map((lang) => lang.code).join(","),
                autoDisplay: false,
              },
              translateRef.current
            );
  
            // Handle dropdown manipulation
            const selectDropdownContainer = (
              translateRef.current as HTMLElement
            ).firstElementChild;
  
            if (selectDropdownContainer) {
              let elementArray: Element[] = [];
              Array.from(selectDropdownContainer.children).forEach((child) => {
                elementArray.push(child);
              });
              selectDropdownContainer.textContent = "";
              elementArray.forEach((child) => {
                selectDropdownContainer.appendChild(child);
              });
            }
  
            // Listen for language change event
            const translateElement = document.querySelector(".goog-te-combo");
            if (translateElement) {
              translateElement.addEventListener("change", () => {
                setTimeout(() => {
                  location.reload();
                }, 500); // Reload the page on language change
              });
            }
          }
        };
      } catch (error) {
        console.error("Error initializing Google Translate:", error);
      }
    };
  
    const handleGlobalErrors = () => {
      window.addEventListener("error", (event) => {
        console.error("Global error detected:", event.error);
      });
  
      window.addEventListener("unhandledrejection", (event) => {
        console.error("Unhandled promise rejection:", event.reason);
      });
    };
  
    setTimeout(() => {
      addGoogleTranslateScript();
      initGoogleTranslate();
    }, 1000);
  
    handleGlobalErrors();
  
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("error", () => {});
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, []);
  

  return (
    <div
      className="w-full h-20 flex flex-row justify-between shadow-xl fixed top-0 left-0 right-0 bg-white z-50"
      ref={headerElement}
      style={{ marginTop: headerTopMargin }}
    >
      <div className="flex flex-row items-center justify-center">
        <Link to={'/home'} className="text-black font-light text-2xl items-center justify-center m-4 flex flex-row">
          <PiRobotThin className="text-5xl"></PiRobotThin>
          <h3 className="hidden md:flex font-light text-black text-5xl logo-text">
            Clark
          </h3>
        </Link>
      </div>

      <div className="flex flex-row justify-center items-center mr-2 md:mr-16 gap-x-3">
        <div className="relative">
          {/* Google Translate Widget Container */}
          <div ref={translateRef}></div>
        </div>

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
