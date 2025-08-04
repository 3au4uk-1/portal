FROM nginx:alpine
COPY html /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites/default.conf /etc/nginx/conf.d/default.conf