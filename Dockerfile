#################### Image build ############################
FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy app into the container app directory
COPY ./app ./

# installing nodemon for hot-reload
RUN npm install --global nodemon