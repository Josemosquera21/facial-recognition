FROM python:3.9-slim

# Instala dependencias necesarias
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libx11-dev \
    libopenblas-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Crea entorno y copia solo los archivos necesarios
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de la aplicación
COPY backend/ .

# Expone el puerto
EXPOSE 8000

CMD ["python", "app.py"]