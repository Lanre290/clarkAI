import { PiRobotThin } from "react-icons/pi";
import googleImage from "./../assets/images/google.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useUser } from "../context/UserContext";

const Login = () => {

  const {setUser} = useUser();


  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setRequestLoading(false); //for the processing div to dissappear
    }, 1500);

    try {
      const body = {
        email: email,
        password: password,
      };

      setRequestLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );


      if (response.ok) {
        setLoading(false);
        let res = await response.json();
        const token = res.token;
        setUser(res);
        localStorage.setItem('user', JSON.stringify(res))
        localStorage.setItem('token', token);
        toast.info('Login successful');

        // Add a little delay before redirecting to ensure user sees login success notification
        setTimeout(() => {
          navigate('/home');
        }, 200);
      } else {
        setLoading(false);
        let res = await response.json();
        toast.error(res.error);
      }

      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-white">
      <form
        action=""
        className="flex flex-col w-full md:w-2/4 lg:w-1/3 bg-white rounded-3xl bg-opacity-90 justify-center items-center p-6 m-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row">
          <PiRobotThin className="text-5xl"></PiRobotThin>
          <h3 className="font-light text-black text-5xl logo-text">Clark</h3>
        </div>

        <div className="p-5 border border-gray-500 rounded-3xl bg-transparent flex flex-row cursor-pointer hover:bg-gray-200 text-2xl gap-x-3 mt-10">
          <img src={googleImage} alt="" className="w-10 h-10 object-contain" />
          Continue with google
        </div>

        <h3 className="text-black text-3xl text-center my-5">OR</h3>
        <div className="flex flex-col w-full md:w-11/12 gap-y-5">
          <input
            type="email"
            className="p-4 w-full border border-black rounded-2xl"
            onInput={(e: any) => {
              setEmail(e.target.value);
            }}
            value={email}
            placeholder="Email..."
            required
          />
          <input
            type="password"
            className="p-4 w-full border border-black rounded-2xl"
            onInput={(e: any) => {
              setPassword(e.target.value);
            }}
            value={[password]}
            placeholder="Password..."
            required
          />

          <Link to="/signup" className="mt-10">
            <h3 className="text-black underline cursor-pointer text-center">
              Don't have an account? Sign up
            </h3>
          </Link>
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

export default Login;
