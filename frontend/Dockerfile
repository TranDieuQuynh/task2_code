FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create .env.production file for React build
RUN echo "REACT_APP_API_URL=/api" > .env.production

# Build the React app
RUN npm run build

# Replace localhost API URL with relative path after build (redundant but harmless now)
RUN sed -i 's|http://localhost:5000/api|/api|g' ./build/static/js/*.js

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 