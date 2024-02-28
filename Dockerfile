# Stage: runtime
FROM nginx:alpine as runtime
RUN rm -rf /usr/share/nginx/html/*
COPY /controller/dist/dao-controller/ /usr/share/nginx/html/
COPY nginx/nginx.dev.conf /etc/nginx/nginx.conf
WORKDIR /app
ENTRYPOINT ["nginx", "-g", "daemon off;"]