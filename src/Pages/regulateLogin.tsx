import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const UseCheckUserSession: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = window.location;

  useEffect(() => {
    if(location.pathname == "/forgot-password"){
      navigate('/forgot-password');
    }
    else{
      if (
      !user &&
      !localStorage.getItem("user") &&
      (location.pathname != "/login" ||
        (location.pathname as string) != "/signup")
    ) {
      if (location.pathname == "/login") {
        navigate("/");
      } else if (location.pathname == "/signup") {
        navigate("/signup");
      }
      else if (location.pathname == "/forgot-password") {
        navigate("/forgot-password");
      } else {
        navigate("/");
        let value = localStorage.getItem('fg') as unknown as boolean;
        if(value){
          navigate(`forgot-password?token=${value}`);
          localStorage.removeItem('fg');
        }
      }
    } else {
      if (localStorage.getItem("token")) {
        const regulate = async () => {
          const token = localStorage.getItem("token");

          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            let res = await response.json();
            const user_ = res.data;
            setUser(user_);
            localStorage.setItem('user', JSON.stringify(user_));
          } else {
            toast.error("Error fetching user Data. Please login again.");
            localStorage.clear();
            navigate("/");
          }
        };

        regulate();

        if (
          location.pathname === "/login" ||
          location.pathname === "/signup" ||
          location.pathname === "/forgot-password"
        ) {
          navigate("/home");
        }
      } else {
        localStorage.clear();
        navigate("/");
      }
    }
    }
  }, []);

  return <>{children}</>;
};

export default UseCheckUserSession;
