import React, { useState } from 'react';
import LoginLogs from './LoginLogs';

function Home() {
  const [showLogs, setShowLogs] = useState(false);
  const userName = localStorage.getItem('userName');

  return (
    <div className="home-container">
      <h1>Bienvenido, {userName}</h1>
      <button 
        className="view-logs-button"
        onClick={() => setShowLogs(true)}
      >
        Ver Historial de Inicios de Sesión
      </button>
      
      {showLogs && <LoginLogs onClose={() => setShowLogs(false)} />}
    </div>
  );
}

export default Home;