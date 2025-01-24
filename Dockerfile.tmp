FROM nginx:latest

COPY out /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY certs/server.crt /etc/ssl/certs/server.crt
COPY certs/server.key /etc/ssl/private/server.key