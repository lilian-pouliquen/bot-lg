FROM docker.home-pouliquen.local/node:24.4.1-alpine-3.22

COPY app/ /app/

RUN pnpm install

VOLUME [ "/app/logs" ]
EXPOSE 3000
CMD [ "pnpm", "start" ]
