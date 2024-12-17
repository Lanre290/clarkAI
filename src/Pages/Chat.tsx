import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { BiEdit } from "react-icons/bi";
import { PiArrowUpBold, PiHouseLight, PiUserCircleThin, PiWaveform } from "react-icons/pi";
import { Link } from "react-router-dom";

const Chat = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex flex-col h-screen w-72 overflow-y-auto bg-gray-100">
        <div className="flex flex-row my-5 px-6 items-center justify-between w-full">
          <Link to={'/home'} onProgress={() => {console.log('dwwddw')}}>
            <PiHouseLight
                className="text-black cursor-pointer text-4xl"
                title="Home"
            ></PiHouseLight>
          </Link>

          <div className="flex flex-row">
            <BiEdit
              className="text-black cursor-pointer text-4xl"
              title="Create new chat"
            ></BiEdit>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-3/6 lg:w-2/5 mx-auto justify-center items-center relative py-14">
        <div className="flex flex-row items-center justify-end w-full absolute right-5 top-2">
            <button className="cursor-pointer" title="My profile">
                <PiUserCircleThin className="text-black text-5xl font-light"></PiUserCircleThin>
            </button>
        </div>
        <h3 className="text-4xl text-black my-10 text-center">
          Hello Sheriff, What can i help you with today?
        </h3>

        <div className="w-full">
            <div className="flex flex-row p-3 pt-0 bg-gray-100 message-from items-center justify-center relative h-20 mb-10" style={{width: '137px'}}>
                <div className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute" style={{left: '16px', animationDelay: '0s'}}></div>
                <div className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute" style={{left: '52px', animationDelay: '0.25s'}}></div>
                <div className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute" style={{left: '92px', animationDelay: '0.5s'}}></div>
            </div>
        </div>

        <div
          className="flex flex-row w-full bg-gray-200 p-2 gap-x-2"
          style={{ borderRadius: "45px" }}
        >
          <input
            type="text"
            className="bg-transparent flex flex-grow w-full focus:outline-none px-5 text-xl"
            placeholder="Message ClarkAI"
            onInput={(e:any) => {
                setMessage(e.target.value)
            }}
            value={message}
          />
          <button
            className="w-12 h-12 min-w-12 rounded-full bg-black flex items-center justify-center"
            style={{ minWidth: "48px" }}
          >
            <PiWaveform className="text-white text-2xl"></PiWaveform>
          </button>
          

          {
            message.length > 0 && 
            <Fade
                direction="left"
                duration={260}
            >
                <button
                    className="w-12 h-12 min-w-12 rounded-full bg-black flex items-center justify-center"
                    style={{ minWidth: "48px" }}
                >
                    <PiArrowUpBold className="text-white text-2xl"></PiArrowUpBold>
          </button>
            </Fade>
          }
        </div>
      </div>
    </div>
  );
};

export default Chat;
