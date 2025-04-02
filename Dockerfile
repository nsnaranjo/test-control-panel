# Stage 1: Build the Angular app using Node.js with Alpine for smaller size
FROM node:18-alpine AS build-env

WORKDIR /app

# Copy only necessary files
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY ./projects ./projects
COPY angular.json ./
COPY tsconfig.json ./

RUN npm run build

# Stage 2: Serve the Angular app with Nginx
FROM nginx:1.13.9-alpine

# Set proper permissions on /var/run/nginx for PID file
RUN touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

# Copy built files from the previous stage
COPY --from=build-env /app/dist/control-panel/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Switch to the new user
USER nginx

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
