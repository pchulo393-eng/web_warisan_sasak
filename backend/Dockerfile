FROM php:8.3-fpm
WORKDIR /var/www
COPY . .
RUN apt-get update && apt-get install -y libpng-dev libonig-dev libxml2-dev zip unzip git && \
    docker-php-ext-install pdo mbstring exif pcntl bcmath gd
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader
RUN php artisan key:generate
EXPOSE 8001
CMD ["php","artisan","serve","--host=0.0.0.0","--port=8001"]