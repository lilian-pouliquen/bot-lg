FROM docker.home-pouliquen.local/node:21.5.0-alpine-3.19

COPY app/ /app/

RUN pnpm install

VOLUME [ "/app/logs" ]
EXPOSE 3000
CMD [ "pnpm", "start" ]
