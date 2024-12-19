import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Styling from "./components/Styling";
import Home from "./Pages/Home";
import Chat from "./Pages/Chat";
import UploadPdf from "./Pages/UploadPdf";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Scanner from "./Pages/Scanner";
import UseCheckUserSession from "./Pages/regulateLogin";

function App() {
  return (
    <>
      <Router>
        <Styling></Styling>
        <UseCheckUserSession>
          <Routes>
            <Route path="/" element={<Navigate to="/home"></Navigate>} />
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/upload-pdf" element={<UploadPdf />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </UseCheckUserSession>
      </Router>
    </>
  );
}

export default App;
