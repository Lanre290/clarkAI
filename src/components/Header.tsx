import { PiCrownBold, PiRobotThin, PiUserCircleThin } from "react-icons/pi";
import { Link } from "react-router-dom";


const Header = () => {
    return (
        <div className="w-full h-full flex flex-row justify-between shadow-xl">
            <div className="flex flex-row items-center justify-center">
                <div className="text-black font-light text-2xl items-center justify-center m-4 flex flex-row">
                    <PiRobotThin className="text-5xl"></PiRobotThin>
                    <h3 className="font-light text-black text-5xl logo-text">Clark</h3>
                </div>
            </div>


            <div className="flex flex-row justify-center items-center mr-16 gap-x-3">
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