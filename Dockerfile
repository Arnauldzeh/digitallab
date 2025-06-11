# Utilise une image Node.js légère
FROM node:18-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers
COPY . .

# Expose le port utilisé par Express.js
EXPOSE 5000

# Démarre l'application
CMD ["node", "index.js"]
