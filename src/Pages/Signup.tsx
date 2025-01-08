import { PiRobotThin } from "react-icons/pi";
import googleImage from "./../assets/images/google.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { Fade } from "react-awesome-reveal";
import { useUser } from "../context/UserContext";
import { countries as listOfCountries } from "./countries";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export interface GoogleSignInResponse {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}
export const googleClientId = import.meta.env.VITE_CLIENT_ID;
// export for use in login page also to avoid multiple imports

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [otp, setOTP] = useState("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otpScreen, setOTPScreen] = useState<boolean>(false);

  useEffect(() => {
    setCountries(listOfCountries);
  }, []);

  const handleSubmit = async (e?: any) => {
    if (isGoogleSignup == false) {
      e.preventDefault();
    }
    setLoading(true);

    setTimeout(() => {
      setRequestLoading(false); //for the processing div to dissappear
    }, 1500);

    try {
      if (!isGoogleSignup) {
        if (password != confirmPassword) {
          throw new Error("passwords do not match.");
        }
      }

      const body = {
        fullname: name,
        email: email,
        password: password,
        country: country,
        is_google: isGoogleSignup,
      };

      setRequestLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
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
        setOTPScreen(true);
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

  const verifyOTP = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setRequestLoading(false); //for the processing div to dissappear
    }, 1500);

    try {
      const body = {
        otp: otp,
        email: email,
      };

      setRequestLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/verify-otp`,
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
        const res = await response.json();
        setUser(res);
        localStorage.setItem("user", JSON.stringify(res.user));
        toast.info("Account created successfully");
        localStorage.setItem("token", res.token);
        setRequestLoading(false);

        // Add a little delay before redirecting to ensure user sees account created notification
        setTimeout(() => {
          navigate("/home");
        }, 200);
      } else {
        setLoading(false);
        setRequestLoading(false);
        const res = await response.json();
        toast.error(res.message);
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
    const token = import.meta.env.VITE_COUNTRY_TOKEN;

    fetch(`https://ipinfo.io?token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        const country_ = data.country;
        setCountry(country_);
        setName(decoded.name);
        setEmail(decoded.email);
        setPassword("");

        setIsGoogleSignup(true);
      });
  };

  const handleGoogleSignupFailure = () => {
    toast.error("Login Failed.");
  };

  useEffect(() => {
    if (isGoogleSignup) {
      handleSubmit();
    }
  }, [email, password, country, name, isGoogleSignup]);

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

      {otpScreen && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 flex justify-center items-center px-3 "
          style={{ backdropFilter: "blur(2px)", zIndex: 99999999 }}
        >
          <form
            className="fixed flex flex-col md:rounded-3xl shadow-2xl md:py-9 px-16 gap-y-5 bg-white w-full h-full md:h-auto md:w-max items-center justify-center"
            onSubmit={verifyOTP}
          >
            <div className="w-full flex flex-col">
              <h3 className="text-black text-center text-wrap text-3xl">
                Enter your OTP
              </h3>
              <h3 className="text-black text-center text-wrap mt-2">
                We sent an email verification code to {email}
              </h3>

              <a
                target="_blank"
                href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox"
                className="p-5 border border-black rounded-3xl bg-transparent flex flex-row cursor-pointer hover:bg-gray-200 text-xl gap-x-3 mt-10 justify-center items-center"
              >
                <img
                  src={googleImage}
                  alt=""
                  className="w-8 h-8 object-contain"
                />
                Open Gmail
              </a>
            </div>

            <input
              type="text"
              className="w-3/4 md:w-auto text-3xl text-black mx-5 placeholder-gray-600 py-3 md:py-9 px-4 font-light bg-gray-200 rounded-xl text-center"
              placeholder="Enter OTP..."
              id=""
              maxLength={4}
              value={otp}
              onInput={(e: any) => {
                setOTP(e.target.value)
              }}
              required
            />
            <button
              type="submit"
              className={`w-full bg-black text-white cursor-pointer rounded-3xl h-16 mt-2 ${
                loading == true && "bg-opacity-50"
              }`}
              disabled={loading}
            >
              {loading == true ? <Loading small={true}></Loading> : "Submit"}
            </button>
          </form>
        </div>
      )}

      <form
        action=""
        className="flex flex-col w-full md:w-2/4 lg:w-1/3 bg-white rounded-3xl bg-opacity-90 justify-center items-center p-6 m-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row mb-5">
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
            type="text"
            className="p-4 w-full border border-black rounded-2xl"
            onInput={(e: any) => {
              setName(e.target.value);
            }}
            value={name}
            placeholder="Name..."
            required
          />
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
            value={password}
            placeholder="Password..."
            required
          />
          <input
            type="password"
            className="p-4 w-full border border-black rounded-2xl"
            onInput={(e: any) => {
              setConfirmPassword(e.target.value);
            }}
            value={confirmPassword}
            placeholder="Password Repeat..."
            required
          />
          <select
            className="p-4 w-full border border-black rounded-2xl cursor-pointer"
            onInput={(e: any) => {
              setCountry(e.target.value);
            }}
            required
          >
            <option value="">Choose your country</option>
            {countries.map((country: any, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>

          <Link to="/login" className="mt-10">
            <h3 className="text-black underline cursor-pointer text-center">
              Already have an account? Log in
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

export default Signup;
