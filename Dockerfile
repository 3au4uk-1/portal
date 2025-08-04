# Используем официальный образ nginx
FROM nginx:alpine

# Копируем HTML-файлы в стандартную папку nginx
COPY html /usr/share/nginx/html

# (Опционально) Копируем кастомный конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Порт, который будет слушать nginx
EXPOSE 443

# Команда для запуска nginx
CMD ["nginx", "-g", "daemon off;"]