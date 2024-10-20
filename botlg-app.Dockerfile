FROM docker.home-pouliquen.local/node:23.0.0-alpine-3.20

COPY app/ /app/

RUN pnpm install

VOLUME [ "/app/logs" ]
EXPOSE 3000
CMD [ "pnpm", "start" ]
