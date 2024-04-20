FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod
EXPOSE 8080
ENTRYPOINT [ "npm", "run", "server" ]
