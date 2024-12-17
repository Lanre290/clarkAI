import { PiArrowUpBold, PiUpload, PiWaveform } from "react-icons/pi";
import Header from "../components/Header";
import { useState } from "react";
import { Fade } from "react-awesome-reveal";

const UploadPdf = () => {
    const [filename, setFilename] = useState('');
    const [message, setMessage] = useState("");


    const changeFile = (e: any) => {
        let file:File = e.target.files[0];
        setFilename(file.name);
    }

    const divHeight = screen.height - 190;



    return (
        <>
            <Header></Header>
            <div className="w-full h-full flex md:flex-row">
                <div className="md:w-2/3 lg:w-4/6 h-full" style={{height: divHeight}}>
                <div className="flex flex-row">
                    <button className="bg-black text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl mt-16 ml-10 relative">
                        <PiUpload className="text-2xl"></PiUpload>
                        upload PDF
                        <input type="file" name="" className="absolute top-0 right-0 left-0 bottom-0 rounded-3xl z-50 cursor-pointer opacity-0" onChange={changeFile} accept=".pdf"/>
                    </button>

                    <h3 className="text-black">{filename}</h3>
                </div>
                </div>


                <div className="md:w-1/3 lg:w-2/6 h-full border-l border-gray-400 px-5 flex flex-col justify-end" style={{height: divHeight}}>
                    <h3 className="text-4xl text-black my-10 text-center">
                    Hello Sheriff, Ask me any question about your pdf?
                    </h3>

                    <div className="w-full">
                        <div className="flex flex-row p-3 pt-0 bg-gray-100 message-from items-center justify-center relative h-20 mb-10" style={{width: '137px'}}>
                            <div className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute" style={{left: '16px', animationDelay: '0s'}}></div>
                            <div className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute" style={{left: '52px', animationDelay: '0.25s'}}></div>
                            <div className="typing-dot w-7 h-7 rounded-full bg-gray-300 absolute" style={{left: '92px', animationDelay: '0.5s'}}></div>
                        </div>
                    </div>

                    <div
                    className="flex flex-row w-11/12 mx-auto bg-gray-200 p-2 gap-x-2"
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
                        disabled={filename.length > 0 ? false : true}
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
                                disabled={filename.length > 0 ? false : true}
                            >
                                <PiArrowUpBold className="text-white text-2xl"></PiArrowUpBold>
                            </button>
                        </Fade>
                    }
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadPdf;