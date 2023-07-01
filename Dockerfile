# Pulling node alpine image
FROM node:20.3.0-alpine3.18

# Installing required packages
RUN \
    apk upgrade --no-cache; \
    \
    wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" \
    && chmod +x /bin/pnpm; \
    \
    pnpm config --global set global-bin-dir /usr/local/bin/;

# Making the 'app' folder the current working directory
WORKDIR /app/

COPY ./app ./

CMD ["node", "index.js"]
