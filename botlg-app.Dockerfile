FROM docker.home-pouliquen.local/node:20.5.0-alpine-3.18

COPY app/ /app/

RUN pnpm install

VOLUME [ "/app/logs" ]
EXPOSE 3000
CMD [ "pnpm", "start" ]
