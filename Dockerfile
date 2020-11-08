#################### Image build ############################
FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY ./app/package*.json ./

# install project dependencies
RUN npm install --production

# copy app into the container app directory
COPY ./app ./

# run app
CMD ["node", "index.js"]