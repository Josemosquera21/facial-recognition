import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WebcamCapture from './WebcamCapture';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [identification, setIdentification] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

  const validateName = (value) => {
    return /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value);
  };

  const validateIdentification = (value) => {
    return /^\d{6,12}$/.test(value);
  };

  const validatePassword = (value) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateName(name)) {
      setMessage('El nombre solo debe contener letras');
      return;
    }
    
    if (!validateIdentification(identification)) {
      setMessage('La identificación debe contener entre 6 y 12 números');
      return;
    }
    
    if (!validatePassword(password)) {
      setMessage('La contraseña debe tener entre 8 y 12 caracteres, incluyendo letras y números');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        name,
        identification,
        password,
        photo
      });
      setMessage(response.data.message);
      setName('');
      setIdentification('');
      setPassword('');
      setPhoto(null);
    } catch (error) {
      console.log('Error details:', error);  // Para ver el error completo en la consola
      setMessage(error.response?.data?.error || 'Error en el registro: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre (solo letras)"
            pattern="[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+"
            title="Solo se permiten letras"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
            placeholder="Número de Identificación (6-12 dígitos)"
            pattern="\d{6,12}"
            title="Debe contener entre 6 y 12 números"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña (8-12 caracteres, letras y números)"
            pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}"
            title="Debe contener entre 8 y 12 caracteres, incluyendo letras y números"
            required
          />
        </div>
        <div className="webcam-container">
          <WebcamCapture onCapture={setPhoto} />
        </div>
        <div className="button-group">
          <button type="submit">Registrar</button>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="back-button"
          >
            Volver a Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;