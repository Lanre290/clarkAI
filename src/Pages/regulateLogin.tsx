import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const UseCheckUserSession: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const location = window.location;

    useEffect(() => {
        if (!user && !localStorage.getItem("user") && (location.pathname != "/login" || location.pathname as string != "/signup")) {
            if(location.pathname == '/login'){
                navigate('/login')
            }
            else if(location.pathname == '/signup'){
                navigate('/signup')
            }
            else{
                navigate("/login");
            }
            toast.error("Your session has expired. Please log in again.");
        } else {
            const user_: any = user || JSON.parse(localStorage.getItem("user") || "{}");
            setUser(user_);
            
            if(location.pathname === "/login" || location.pathname === "/signup"){
                navigate('/home');
            }
        }
    }, [user, setUser, navigate]);

    return <>{children}</>; // Render children if provided
};

export default UseCheckUserSession;
