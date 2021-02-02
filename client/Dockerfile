FROM node:alpine as builder
RUN mkdir -p /app/client
WORKDIR 'app/client'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 8080

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/client/dist /usr/share/nginx/html


