import { PiRobotThin } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useUser } from "../context/UserContext";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { googleClientId, GoogleSignInResponse } from "./Signup";
import { jwtDecode } from "jwt-decode";
import { Fade } from "react-awesome-reveal";

const Login = () => {

  const {setUser} = useUser();


  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const triggerForgotPassword = async () => {
    try {
      if(!email){
        toast.error("Email is required.");
        throw new Error('');
      }

      if (!emailRegex.test(email)){
        toast.error("Invalid email.");
        throw new Error('');
      }

      const body = {
        email: email,
        url: `${window.location.protocol}//${location.host}`
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
  
      if (response.ok) {
        toast.info('A reset password mail has been sent to your inbox.', {
          autoClose: 10000,
        });
      } else {
        toast.info('Error sending forgot a password mail.', {
          autoClose: 5000,
        });
      }
        
    } catch (error: any) {
      
    }
      
  }

  const handleSubmit = async (e?: any) => {
    if(isGoogleSignup == false){
      e.preventDefault();
    }
    setLoading(true);

    setTimeout(() => {
      setRequestLoading(false); //for the processing div to dissappear
    }, 1500);

    try {
      const body = {
        email: email,
        password: password,
        is_google: isGoogleSignup
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
        localStorage.setItem('user', JSON.stringify(res.user))
        localStorage.setItem('token', token);
        toast.info('Login successful');

        // Add a little delay before redirecting to ensure user sees login success notification
        setTimeout(() => {
          navigate('/home');
        }, 200);
      } else {
        setLoading(false);
        setRequestLoading(false);
        let res = await response.json();
        toast.error(res.error);
      }

      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignup = (response: any) => {
    const { credential } = response; // JWT token
    const decoded: GoogleSignInResponse = jwtDecode(credential);

    
    setIsGoogleSignup(true);
    setEmail(decoded.email)
    setPassword('');
  };

  useEffect(() => {
    if(isGoogleSignup){
      handleSubmit();
    }
  }, [email, isGoogleSignup]);
  

  const handleGoogleSignupFailure = () => {
    toast.error("Login Failed");
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

        <div className="google-signing-cont">
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={handleGoogleSignupFailure}
            ></GoogleLogin>
          </GoogleOAuthProvider>
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

            <h3 className="text-black hover:underline cursor-pointer text-right" onClick={triggerForgotPassword}>
              Forgot password?
            </h3>

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
