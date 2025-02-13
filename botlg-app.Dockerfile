FROM docker.home-pouliquen.local/node:23.7.0-alpine-3.21

COPY app/ /app/

RUN pnpm install

VOLUME [ "/app/logs" ]
EXPOSE 3000
CMD [ "pnpm", "start" ]
