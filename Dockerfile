FROM node:14
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:prod
EXPOSE 8080
ENTRYPOINT [ "npm", "run", "server" ]
