import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoginLogs({ onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs');
        setLogs(response.data.reverse()); // Para mostrar los más recientes primero
      } catch (error) {
        console.error('Error al obtener logs:', error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="user-list-modal">
      <div className="user-list-content">
        <h2>Historial de Inicios de Sesión</h2>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>ID</th>
              <th>Fecha y Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.user_name}</td>
                <td>{log.user_id}</td>
                <td>{log.login_time}</td>
                <td>{log.status === 'success' ? 'Exitoso' : 'Fallido'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="close-button">Cerrar</button>
      </div>
    </div>
  );
}

export default LoginLogs;