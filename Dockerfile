# Pulling node alpine image
FROM node:20.3.0-alpine3.18

# Installing required packages
RUN \
    apk upgrade --no-cache; \
    \
    wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" \
    && chmod +x /bin/pnpm; \
    \
    pnpm config --global set global-bin-dir /usr/local/bin/; \
    \
    pnpm add -g nodemon;

# Making the 'app' folder the current working directory
WORKDIR /app

# Copying app into the container app directory
COPY ./app ./

CMD ["nodemon", "index.js"]
