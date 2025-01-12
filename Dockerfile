FROM nginx:latest

COPY out /usr/share/nginx/html

COPY ./nginx/certs /etc/nginx/certs

COPY nginx.conf /etc/nginx/conf.d/default.conf
