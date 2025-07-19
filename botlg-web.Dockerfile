FROM docker.home-pouliquen.local/httpd:2.4.64-alpine-3.22

COPY mkdocs/build/ /usr/local/apache2/htdocs/
EXPOSE 80
CMD ["httpd-foreground"]
