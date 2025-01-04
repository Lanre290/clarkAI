import React, { useState } from "react";
import Loading from "../components/Loading";
import { Fade } from "react-awesome-reveal";
import { PiRobotThin } from "react-icons/pi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPasword, setRepeatPassword] = useState("");


    const navigate = useNavigate();

  const url = window.location.href;
  const params = new URLSearchParams(new URL(url).search);
  const token = params.get("token");
  if(!token){
    navigate('/login');
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!password || !repeatPasword){
        toast.error("Fill in all fields.");
        throw new Error('');
      }

      if (password !== repeatPasword){
        toast.error("Passwords do not match.");
        throw new Error('');
      }


      const body = {
        signature: token,
        password: password,
      };
  
      setLoading(true);
      setRequestLoading(true);
      setTimeout(() => {
          setRequestLoading(false);
      }, 1000);
  
  
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
  
      if (response.ok) {
        setLoading(false);
        setRequestLoading(false);
        
        let res = await response.json();
        toast.info(res.message);
      } else {
        setLoading(false);
        setRequestLoading(false);
        let res = await response.json();
        toast.error(res.error);
      }
    } catch (error: any) {

    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-white overflow-x-hidden">
      {requestLoading && (
        <Fade direction="right" duration={300} style={{ zIndex: 9999 }}>
          <div className="fixed top-16 right-10 rounded-2xl bg-white flex flex-row gap-x-4 p-5 shadow-2xl pr-16">
            <Loading small={true}></Loading>
            <h3 className="text-black">Processing...</h3>
          </div>
        </Fade>
      )}
      <form
        action=""
        className="flex flex-col w-full md:w-2/4 lg:w-1/3 bg-white rounded-3xl bg-opacity-90 justify-center items-center p-6 m-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row">
          <PiRobotThin className="text-5xl"></PiRobotThin>
          <h3 className="font-light text-black text-5xl logo-text">Clark</h3>
        </div>

        <h3 className="text-black text-3xl text-center my-5">
          Reset your password
        </h3>
        <div className="flex flex-col w-full md:w-11/12 gap-y-5">
          <input
            type="password"
            className="p-4 w-full border border-black rounded-2xl"
            onInput={(e: any) => {
              setPassword(e.target.value);
            }}
            value={password}
            placeholder="Password..."
            required
          />
          <input
            type="password"
            className="p-4 w-full border border-black rounded-2xl"
            onInput={(e: any) => {
              setRepeatPassword(e.target.value);
            }}
            value={[repeatPasword]}
            placeholder="Repeat password..."
            required
          />

          <button
            type="submit"
            className={`w-full bg-black text-white cursor-pointer rounded-3xl h-16 mt-2 ${
              loading == true && "bg-opacity-50"
            }`}
            disabled={loading}
          >
            {loading == true ? (
              <div className="mx-auto w-fit">
                <Loading small={true}></Loading>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
