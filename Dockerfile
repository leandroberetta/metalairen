# Usa la imagen oficial de Nginx
FROM nginx:alpine

# Copia los archivos exportados al directorio raíz de Nginx
COPY out /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80