#################### Image build ############################
FROM node:lts-alpine as build

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY /project/package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./project/ .

# build app for production with minification
RUN npm run build

#################### Image finale ############################
FROM httpd:2.4.41-alpine 

COPY --from=build /app/dist/ /usr/local/apache2/htdocs/
