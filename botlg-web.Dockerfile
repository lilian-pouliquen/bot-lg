FROM docker.home-pouliquen.local/httpd:2.4.57-alpine-3.18

COPY mkdocs/build/fr/ /usr/local/apache2/htdocs/
EXPOSE 80
CMD ["httpd-foreground"]
