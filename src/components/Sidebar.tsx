import { PiHouseSimpleThin, PiUserCircleThin } from "react-icons/pi";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="flex flex-col fixed top-96 h-auto p-4 rounded-tr-3xl rounded-br-3xl shadow-2xl bg-white z-50">
            <Link to={'/home'} className="p-4 cursor-pointer">
                <PiHouseSimpleThin className="text-black text-5xl"></PiHouseSimpleThin>
            </Link>
            <Link to={'/profile'} className="p-4 cursor-pointer">
                <PiUserCircleThin className="text-black text-5xl"></PiUserCircleThin>
            </Link>
        </div>
    )
}

export default Sidebar;