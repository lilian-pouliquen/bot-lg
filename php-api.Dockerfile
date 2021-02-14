# Pulling alpine image
FROM alpine:latest

# Installing required packages
RUN apk add --quiet bash apache2 php7 php7-pdo php7-pgsql php7-pdo_pgsql

# Adding apache2 configurations
RUN echo "ServerTokens Prod" >> /etc/apache2/conf.d/prod.conf
RUN echo "ServerSignature Off" >> /etc/apache2/conf.d/prod.conf

# Copying required files
COPY ./php-api/ /var/www/localhost/htdocs/

# Exposing port 80
EXPOSE 80

# Starting apache service
CMD ["exec", "/usr/sbin/httpd", "-D", "FOREGROUND", "-f", "/etc/apache2/httpd.conf"]