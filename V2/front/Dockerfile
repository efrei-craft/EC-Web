# Use an official Node image to build the app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Accept build argument
ARG VITE_PRODUCTION=True

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Set environment variable for production build
ENV VITE_PRODUCTION=$VITE_PRODUCTION

# Build the app
RUN npm run build

# -----------------------------

# Use an official NGINX image to serve the built files
FROM nginx:alpine

# Copy the build output to the NGINX html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default NGINX config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom NGINX config
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]