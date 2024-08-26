FROM docker.home-pouliquen.local/httpd:2.4.61-alpine-3.20

COPY mkdocs/build/ /usr/local/apache2/htdocs/
EXPOSE 80
CMD ["httpd-foreground"]
