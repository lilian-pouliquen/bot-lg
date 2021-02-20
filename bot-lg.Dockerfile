# Pulling node alpine image
FROM node:lts-alpine

# Making the 'app' folder the current working directory
WORKDIR /app

# Copying app into the container app directory
COPY ./app ./

# Installing nodemon for hot-reload
RUN npm install --global nodemon > /dev/null

CMD ["nodemon", "index.js"]