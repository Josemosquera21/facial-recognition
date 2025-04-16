import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WebcamCapture from './WebcamCapture';

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    identification: user?.identification || '',
    password: '',
    photo: user?.photo || ''
  });
  const [message, setMessage] = useState('');

  const validateName = (value) => {
    return /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value);
  };

  const validateIdentification = (value) => {
    return /^\d{6,12}$/.test(value);
  };

  const validatePassword = (value) => {
    if (!value) return true; // Permitir contraseña vacía para mantener la actual
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateName(formData.name)) {
      setMessage('El nombre solo debe contener letras');
      return;
    }
    
    if (!validateIdentification(formData.identification)) {
      setMessage('La identificación debe contener entre 6 y 12 números');
      return;
    }
    
    if (formData.password && !validatePassword(formData.password)) {
      setMessage('La contraseña debe tener entre 8 y 12 caracteres, incluyendo letras y números');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user.identification}`, formData);
      if (response.data.success) {
        setMessage('Usuario actualizado correctamente');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error actualizando usuario');
    }
  };

  return (
    <div className="login-container">
      <h2>Actualizar Usuario</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre (solo letras)"
            pattern="[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+"
            title="Solo se permiten letras"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="identification"
            value={formData.identification}
            disabled
            placeholder="Número de Identificación"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nueva Contraseña (dejar en blanco para mantener la actual)"
            pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}"
            title="Debe contener entre 8 y 12 caracteres, incluyendo letras y números"
          />
        </div>
        <div className="webcam-container">
          <WebcamCapture onCapture={(photo) => setFormData({...formData, photo})} />
        </div>
        <div className="button-group">
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate('/')} className="back-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateUser;