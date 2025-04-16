import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WebcamCapture from './WebcamCapture';
import UserList from './UserList';

function Login() {
  const navigate = useNavigate();
  const [identification, setIdentification] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [showUsers, setShowUsers] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        identification,
        password,
        photo
      });

      if (response.data.success) {
        setMessage('Login exitoso');
        localStorage.setItem('userName', response.data.name);
        setTimeout(() => navigate('/home'), 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error en el login');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <button 
        className="view-users-button" 
        onClick={() => setShowUsers(true)}
      >
        Ver Usuarios Registrados
      </button>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
            placeholder="Número de Identificación"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <div className="webcam-container">
          <WebcamCapture onCapture={setPhoto} />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div className="register-link">
        <p>¿No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
      </div>
      {showUsers && <UserList onClose={() => setShowUsers(false)} />}
    </div>
  );
}

export default Login;