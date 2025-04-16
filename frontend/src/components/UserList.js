import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserList({ onClose }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (identification) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${identification}`);
      fetchUsers(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = (user) => {
    navigate('/update-user', { state: { user } });
  };

  return (
    <div className="user-list-modal">
      <div className="user-list-content">
        <h2>Usuarios Registrados</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Identificación</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.identification}</td>
                <td>{user.created_at}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleUpdate(user)}
                      className="update-button"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(user.identification)}
                      className="delete-button"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="close-button">Cerrar</button>
      </div>
    </div>
  );
}

export default UserList;