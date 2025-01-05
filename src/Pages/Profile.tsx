import { useEffect, useState } from "react";
import Header from "../components/Header";
import userAvatar from "./../assets/images/user.png";
import Sidebar from "../components/Sidebar";
import { User, useUser } from "../context/UserContext";
import { BiEdit } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { PiArrowLeft } from "react-icons/pi";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser } = useUser();
  const [streakDays, setStreakDays] = useState(0);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEditProfileUI, setIsEditProfileUI] = useState(false);
  const [userName, setUserName] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const submitRequest = async () => {
    setSubmittingRequest(true);
    const token = localStorage.getItem("token");

    const body = {
      name: userName,
    };

    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(body),
            }
          );
      
          if (response.ok) {
            let user_: User | null = user;
            (user_ as User).name = userName;
            setUser(user_);
            setName(userName);
            setSubmittingRequest(false);
            setIsEditProfileUI(false);
            toast.info('Account updated successfully.');
          } else {
            setSubmittingRequest(false);
            toast.error("Error updating your details.");
          }
    } catch (error) {
        console.log(error);
        toast.error('Error updating your account.');
        setSubmittingRequest(false);
    }
  };

  useEffect(() => {
    let new_user;
    new_user = user;
    console.log(new_user)

    if(!user){
        const object = JSON.parse(localStorage.getItem('user') as string);
        setUser(object);
        console.log(object);
        new_user = object;
        setName((new_user as any)?.name as string);
        setEmail((new_user as any)?.email as string);
        setStreakDays((new_user as any)?.streak_count as number);
    }
    
  }, []);

  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>

      {isEditProfileUI && (
        <div
          className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 flex items-center justify-center flex-col"
          style={{ zIndex: 100 }}
        >
          <div className="w-full h-full md:h-auto bg-white md:rounded-3xl flex flex-col md:justify-center items-center pt-5 md:pt-0 gap-y-10 md:gap-y-0 p-6 md:w-96 xl:w-96">
            {screen.width > 768 ? (
              <div className="flex flex-row justify-end w-11/12 mt-5">
                <button
                  className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setIsEditProfileUI(false);
                  }}
                >
                  <CgClose className="text-blacl text-2xl"></CgClose>
                </button>
              </div>
            ) : (
              <div className="flex w-full justify-start mt-5">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setIsEditProfileUI(false);
                  }}
                >
                  <PiArrowLeft className="text-blacl text-xl"></PiArrowLeft>
                </button>
              </div>
            )}

            <div className="w-full flex flex-col justify-start items-center gap-y-10">
              <h3 className="text-black text-2xl md:text-4xl text-center">
                Edit your profile
              </h3>
              <div className="w-full flex flex-col gap-y-6 items-center justify-center">
                <input
                  type="text"
                  onInput={(e: any) => {
                    setUserName(e.target.value);
                  }}
                  value={userName}
                  className="border-2 border-black p-3 rounded-2xl w-11/12 md:w-64"
                  placeholder="Full name..."
                ></input>
              </div>

              <button
                className={`flex flex-row gap-x-4 p-3 px-6 items-center justify-center drop-shadow-2xl md:mx-0 mx-auto my-1 bg-black text-white ${
                  submittingRequest
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                } rounded-2xl w-11/12 md:w-64`}
                onClick={submitRequest}
                title={
                  submittingRequest ? "processing your request" : "Click to proceed."
                }
              >
                {submittingRequest ? <Loading small></Loading> : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-start pt-24">
        <div className="flex flex-col mx-auto justify-center items-center">
          <img
            src={userAvatar}
            alt="user"
            className="w-36 h-36 md:w-56 md:h-56 rounded-full object-cover mx-auto"
          />
          <h3 className="text-black text-3xl md:text-6xl mx-auto mb-10 text-center">
            {name}
          </h3>
        </div>

        <div className="flex flex-col w-full px-2 items-center md:w-2/3 lg:w-2/4 mx-auto gap-5 md:mt-10 pb-20 md:pb-0 tilt-cont">
          <div className="w-full mx-2 rounded-3xl bg-blue-300 text-white h-64">
            <h3 className="text-white text-start w-11/12 h-full flex items-center text-2xl mx-auto flex-col justify-center">
              <h3 className="text-center">
                Nationality: {(user as any)?.country as string}
                <br />
              </h3>
              <h3 className="text-center">
                Streak: {streakDays} days <br />
              </h3>
              <h3 className="text-center">Email: {email}</h3>
            </h3>
          </div>

          <button
            className="bg-black text-white rounded-3xl cursor-pointer flex flex-row gap-x-4 p-5 px-8 items-center justify-center drop-shadow-2xl"
            onClick={() => {
              setIsEditProfileUI(true);
              setUserName(name);
            }}
          >
            <BiEdit className="text-2xl"></BiEdit>
            Edit profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
