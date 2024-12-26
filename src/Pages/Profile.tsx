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
        setName((user as any)?.name as string);
        setEmail((user as any)?.email as string);
        setStreakDays((user as any)?.streak_count as number);
    }, [])

    return(
        <>
            <Header></Header>
            <Sidebar></Sidebar>
            <div className="flex flex-col justify-center items-start pt-24">
            <div className="flex flex-col mx-auto justify-center items-center">
                <img src={userAvatar} alt="user" className="w-56 h-56 rounded-full object-cover mx-auto" />
                <h3 className="text-black text-3xl md:text-6xl mx-auto mb-10 text-center">{name}</h3>
            </div>                


                <div className="flex flex-col w-full px-2 items-center md:w-2/3 lg:w-2/4 mx-auto gap-5 md:mt-10 pb-20 md:pb-0 tilt-cont">
                    <div className="w-full mx-2 rounded-3xl bg-blue-300 text-white h-64">
                        <h3 className="text-white text-start w-11/12 h-full flex items-center text-2xl mx-auto flex-col justify-center">
                            <h3>Nationality: {(user as any)?.country as string}<br /></h3>
                            <h3>Streak: {streakDays} days <br /></h3>
                            <h3>Email: {email}</h3>
                        </h3>
                    </div>

                    {/* <button className="bg-black text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-5 px-8 items-center justify-center drop-shadow-2xl">
                        <BiEdit className="text-2xl"></BiEdit>
                        Edit profile
                    </button> */}
                </div>
            </div>
        </>
    )
}

export default Profile;