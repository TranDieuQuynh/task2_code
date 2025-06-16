FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 3000

CMD echo "Checking environment variables:" && \
    env | grep POSTGRES && \
    npm start 