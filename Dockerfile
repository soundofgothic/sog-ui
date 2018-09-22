FROM node as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run-script build -- --prod
RUN ls /
FROM nginx:1.15
COPY --from=node /app/dist/siz-ui /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/ui.conf
EXPOSE 80
