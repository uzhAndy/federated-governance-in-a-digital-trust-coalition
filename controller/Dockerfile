# Stage: build
FROM node:18 as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
ARG RUNMODE
ARG DAO_AGENT_HOST=${DAO_AGENT_HOST:-"localhost"}
ENV RUNMODE=${RUNMODE} DAO_AGENT_HOST=${DAO_AGENT_HOST} USER_CRED_DEF=${USER_CRED_DEF}
RUN npm run build