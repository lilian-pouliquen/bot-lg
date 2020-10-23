#################### Image build ############################
FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY ./app/package*.json ./

# install project dependencies
RUN npm install

# copy app into the container app directory
COPY ./app ./

# expose port 8080
EXPOSE 8080

# run app
CMD ["node", "index.js"]