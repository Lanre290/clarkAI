import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const UseCheckUserSession: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !localStorage.getItem("user")) {
            navigate("/login");
            toast.error("Your session has expired. Please log in again.");
        } else {
            const user_: any = user || JSON.parse(localStorage.getItem("user") || "{}");
            setUser(user_);

            // redirect to home if trying to login when logged in
            const location = window.location;
            if(location.pathname === "/login" || location.pathname === "/signup"){
                navigate('/home');
            }
        }
    }, [user, setUser, navigate]);

    return <>{children}</>; // Render children if provided
};

export default UseCheckUserSession;
