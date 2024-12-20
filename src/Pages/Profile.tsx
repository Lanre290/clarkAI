import { useEffect, useState } from "react";
import Header from "../components/Header";
import userAvatar from './../assets/images/user.png';
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import { BiEdit } from "react-icons/bi";


const Profile = () => {
    const {user} = useUser();
    const [streakDays, setStreakDays] = useState(0);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        setName(user?.user.name as string);
        setEmail(user?.user.email as string);
        setStreakDays(user?.user.streak_count as number);
    }, [])

    return(
        <>
            <Header></Header>
            <Sidebar></Sidebar>
            <div className="flex flex-col justify-center items-start pt-24">
            <div className="flex flex-col mx-auto justify-center items-center">
                <img src={userAvatar} alt="user" className="w-56 h-56 rounded-full object-cover mx-auto" />
                <h3 className="text-blaack text-6xl mx-auto mb-10">{name}</h3>
            </div>                


                <div className="flex flex-col w-full px-2 items-center md:w-2/3 lg:w-2/4 mx-auto gap-5 mt-10 pb-20 md:pb-0 tilt-cont">
                    <div className="w-full mx-2 rounded-3xl bg-blue-300 text-white h-64">
                        <h3 className="text-white text-start w-11/12 h-full flex items-center text-2xl mx-auto">
                            Nationality: {user?.user.country as string}<br />
                            Streak: {streakDays} days <br />
                            Email: {email}
                        </h3>
                    </div>

                    <button className="bg-black text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-5 px-8 items-center justify-center drop-shadow-2xl">
                        <BiEdit className="text-2xl"></BiEdit>
                        <h3 className="hidden md:flex">Edit profile</h3>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Profile;