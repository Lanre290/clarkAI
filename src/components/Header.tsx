import { useEffect } from "react";
import { PiCrownBold, PiRobotThin, PiUserCircleThin } from "react-icons/pi";
import { Link } from "react-router-dom";

declare global {
    interface Window {
      googleTranslateElementInit: () => void;
      google: any;
    }
  }

const Header = () => {

    // useEffect(() => {
        // Ensure the Google Translate element is initialized after component mount
    //     document.onload = () => {
    //         if (window.google && window.google.translate) {
    //             window.googleTranslateElementInit();
    //           }
    //     }
    //   }, []);

      useEffect(() => {
        document.onload = () => {
            const initializeGoogleTranslate = () => {
                // Clear any existing translation elements
                const translateElement = document.getElementById("google_translate_element");
                if (translateElement) {
                    translateElement.innerHTML = "";
                }
    
                // Reinitialize the Google Translate widget
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'es,fr,de,it,pt,zh,ja,ko,ar,ru,hi,sw',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    'google_translate_element'
                );
            };
    
            if (window.google && window.google.translate) {
                initializeGoogleTranslate();
            } else {
                window.googleTranslateElementInit = initializeGoogleTranslate;
            }
        }
    }, []);


    return (
        <div className="w-full h-full flex flex-row justify-between shadow-xl">
            <div className="flex flex-row items-center justify-center">
                <div className="text-black font-light text-2xl items-center justify-center m-4 flex flex-row">
                    <PiRobotThin className="text-5xl"></PiRobotThin>
                    <h3 className="font-light text-black text-5xl logo-text">Clark</h3>
                </div>
            </div>


            <div className="flex flex-row justify-center items-center mr-16 gap-x-3">
                <div id="google_translate_element"></div>
                <button className="bg-black text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl">
                    <PiCrownBold className="text-2xl"></PiCrownBold>
                    Go premium
                </button>
                <Link to={'/profile'}>
                    <button className="cursor-pointer" title="My profile">
                        <PiUserCircleThin className="text-black text-5xl font-light"></PiUserCircleThin>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Header;