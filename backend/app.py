from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import bcrypt
import face_recognition
import numpy as np
import base64
import io
from PIL import Image
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Modificar la conexión a MongoDB para usar variable de entorno
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
try:
    client = MongoClient(MONGODB_URI)
    db = client['facial_recognition']
    users = db['users']
    logs = db['logs']
    print("Conexión exitosa a MongoDB")
except Exception as e:
    print("Error conectando a MongoDB:", str(e))


# Crear usuario
@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.json
        name = data.get('name')
        identification = data.get('identification')
        password = data.get('password')
        photo_base64 = data.get('photo')

        if not all([name, identification, password, photo_base64]):
            return jsonify({'success': False, 'error': 'Faltan datos requeridos'}), 400

        if users.find_one({'identification': identification}):
            return jsonify({'success': False, 'error': 'El número de identificación ya está registrado'}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user = {
            'name': name,
            'identification': identification,
            'password': hashed_password,
            'photo': photo_base64,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        users.insert_one(user)

        return jsonify({'success': True, 'message': 'Usuario creado correctamente'}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': f'Error en el servidor: {str(e)}'}), 500


# Login con contraseña y reconocimiento facial
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    identification = data.get('identification')
    password = data.get('password')
    login_photo = data.get('photo')

    try:
        user = users.find_one({'identification': identification})

        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 401

        stored_password = user['password']
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')

        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return jsonify({'success': False, 'error': 'Contraseña incorrecta'}), 401

        # Procesar foto almacenada
        stored_photo_data = user['photo'].split(',')[1]
        stored_image = Image.open(io.BytesIO(base64.b64decode(stored_photo_data)))
        stored_encodings = face_recognition.face_encodings(np.array(stored_image))

        if not stored_encodings:
            return jsonify({'success': False, 'error': 'No se detectó rostro en la imagen almacenada'}), 400

        stored_encoding = stored_encodings[0]

        # Procesar foto de inicio de sesión
        login_photo_data = login_photo.split(',')[1]
        login_image = Image.open(io.BytesIO(base64.b64decode(login_photo_data)))
        login_encodings = face_recognition.face_encodings(np.array(login_image))

        if not login_encodings:
            return jsonify({'success': False, 'error': 'No se detectó rostro en la imagen de inicio de sesión'}), 400

        login_encoding = login_encodings[0]

        match = face_recognition.compare_faces([stored_encoding], login_encoding, tolerance=0.6)

        # En la función login, después del match facial
        if match[0]:
            try:
                # Guardar el log con formato de fecha correcto
                log_entry = {
                    'user_name': user['name'],
                    'user_id': user['identification'],
                    'login_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'status': 'success'
                }
                
                # Insertar el log y verificar
                result = logs.insert_one(log_entry)
                print(f"Log guardado: {log_entry}")  # Debug

                return jsonify({
                    'success': True,
                    'message': 'Login exitoso',
                    'name': user['name']
                })
            except Exception as e:
                print(f"Error al guardar log: {str(e)}")
                return jsonify({
                    'success': True,
                    'message': 'Login exitoso pero error al guardar log',
                    'name': user['name']
                })
        else:
            return jsonify({'success': False, 'error': 'Rostro no coincide'}), 401

    except Exception as e:
        return jsonify({'success': False, 'error': f'Error en el servidor: {str(e)}'}), 500


# Obtener lista de usuarios (sin contraseña)
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        user_list = list(users.find({}, {'password': 0}))
        for user in user_list:
            user['_id'] = str(user['_id'])
        return jsonify(user_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Eliminar usuario
@app.route('/api/users/<identification>', methods=['DELETE'])
def delete_user(identification):
    try:
        result = users.delete_one({'identification': identification})
        if result.deleted_count > 0:
            return jsonify({'success': True, 'message': 'Usuario eliminado correctamente'})
        return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# Actualizar usuario
@app.route('/api/users/<identification>', methods=['PUT'])
def update_user(identification):
    try:
        data = request.json
        update_data = {}

        if 'name' in data:
            update_data['name'] = data['name']
        if 'password' in data:
            update_data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        if 'photo' in data:
            update_data['photo'] = data['photo']

        if update_data:
            users.update_one({'identification': identification}, {'$set': update_data})
            return jsonify({'success': True, 'message': 'Usuario actualizado correctamente'})
        return jsonify({'success': False, 'error': 'No se enviaron datos para actualizar'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# Obtener lista de logs
@app.route('/api/logs', methods=['GET'])
def get_logs():
    try:
        log_list = list(logs.find())
        for log in log_list:
            log['_id'] = str(log['_id'])
        return jsonify(log_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Al final del archivo, modificar el run
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
