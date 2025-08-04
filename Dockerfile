# Use the official Nginx image
FROM nginx:alpine

# Copy the HTML files to the Nginx html directory
COPY html/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]