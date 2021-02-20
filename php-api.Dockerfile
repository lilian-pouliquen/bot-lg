# Pulling alpine image
FROM php:apache

# Installing required packages 
RUN apt-get update -qq > /dev/null
RUN apt-get install --no-install-recommends -qq libpq-dev > /dev/null

# Installing php extensions
RUN docker-php-ext-install pdo_pgsql pgsql > /dev/null

# Adding apache2 configurations
RUN echo "ServerTokens Prod" >> /etc/apache2/apache2.conf
RUN echo "ServerSignature Off" >> /etc/apache2/apache2.conf

# Copying required files
COPY ./php-api/ /var/www/html/

# Exposing port 80
EXPOSE 80

# Starting apache service
CMD ["apache2-foreground", "-f", "/etc/apache2/apache2.conf"]