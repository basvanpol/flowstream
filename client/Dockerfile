FROM node:alpine as builder
RUN mkdir -p /app/client
WORKDIR 'app/client'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx

COPY --from=builder /app/client/nginx.conf /etc/nginx

COPY --from=builder /app/client/dist /usr/share/nginx/html


