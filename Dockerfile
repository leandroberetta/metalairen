# Usa la imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

# Instala todas las dependencias (incluidas las de desarrollo)
RUN npm ci

# Copia el resto del código fuente al contenedor
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Construye la aplicación Next.js
RUN npm run build

# Elimina las dependencias de desarrollo para reducir el tamaño de la imagen
RUN npm prune --production

# Expone el puerto en el contenedor
EXPOSE 3000

# Comando predeterminado para iniciar la aplicación
CMD ["npm", "start"]

