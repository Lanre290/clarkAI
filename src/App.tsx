import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Styling from './components/Styling'
import Home from './Pages/Home';
import Chat from './Pages/Chat';
import UploadPdf from './Pages/UploadPdf';
import Profile from './Pages/Profile';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

function App() {

  return (
    <>
    <Router>
      <Styling></Styling>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/upload-pdf' element={<UploadPdf />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
