FROM docker.home-pouliquen.local/httpd:2.4.59-alpine-3.19

COPY mkdocs/build/ /usr/local/apache2/htdocs/
EXPOSE 80
CMD ["httpd-foreground"]
