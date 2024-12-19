import { useState } from "react";
import Header from "../components/Header";
import userAvatar from './../assets/images/user.png';
import Sidebar from "../components/Sidebar";

const Profile = () => {
    const [streakDays, setStreakDays] = useState(0);
    return(
        <>
            <Header></Header>
            <Sidebar></Sidebar>
            <div className="flex flex-col justify-center items-start pt-24">
            <div className="flex flex-col mx-auto justify-center items-center">
                <img src={userAvatar} alt="user" className="w-56 h-56 rounded-full object-cover mx-auto" />
                <h3 className="text-blaack text-6xl mx-auto mb-10">Ashiru Sheriff Olanrewaju</h3>
            </div>                


                <div className="flex flex-col md:flex-row md:w-2/3 lg:w-2/4 mx-auto gap-5 mt-10">
                    <div className="w-1/2 rounded-3xl bg-blue-300 text-white h-64">
                        <h3 className="text-white text-start w-11/12 h-full flex items-center text-xl mx-auto">
                            Nationality: Nigerian<br />
                            Streak: {streakDays} days
                        </h3>
                    </div>


                    <div className="w-1/2 rounded-3xl bg-purple-300 text-white h-64">
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;