import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UpdateUser from './components/UpdateUser';
import Home from './components/Home';
import LoginLogs from './components/LoginLogs';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logs" element={<LoginLogs />} /> {/* Nueva ruta */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;