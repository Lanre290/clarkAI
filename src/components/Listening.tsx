import { SlMicrophone } from "react-icons/sl";

const Listening = () => {
    return (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex flex-col items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="glow">
            <div className="glow_2">
              <div className="w-36 h-36 rounded-full text-gray-50 text-2xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
                <SlMicrophone className="text-4xl"></SlMicrophone>
              </div>
            </div>
          </div>
          <h3 className="text-white text-5xl">Listening...</h3>
        </div>
    )
}

export default Listening;