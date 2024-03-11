# Development stage
FROM node:18 as dev
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
CMD ["npm", "start"]

# Build stage
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as prod
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]