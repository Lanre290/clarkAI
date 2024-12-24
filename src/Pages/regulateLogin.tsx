import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

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
            else if(location.pathname == '/'){
                navigate('/')
            }
            else{
                navigate("/home");
            }
        } else {
            const user_: any = JSON.parse(localStorage.getItem("user") as string);
            setUser(user_);
            
            if(location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/"){
                navigate('/home');
            }
        }
    }, []);

    return <>{children}</>;
};

export default UseCheckUserSession;
