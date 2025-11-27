FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Fix Vite permission issue
RUN chmod -R +x node_modules/.bin

RUN npm run build

# ---------------------
# Stage 2: Serve with NGINX
# ---------------------
FROM nginx:alpine

# Remove this line because you do NOT have nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
