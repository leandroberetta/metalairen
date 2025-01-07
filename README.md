# MetaLairen

## Crear base de datos de MetaLairen

El siguiente comando iniciará la base de datos e importará los datos:

´´´
docker run --name metalairen-db -p 3306:3306   -e MYSQL_ROOT_PASSWORD=metalairen   -e MYSQL_DATABASE=metalairen   -v ./dump.sql:/docker-entrypoint-initdb.d/dump.sql   -d mysql
´´´

## Desplegar MetaLairen estático

Ejecutar los siguientes pasos (es necesario tener la base de datos levantada):

´´´
npm run build

docker build metalairen .
docker run -p 8080:80 metalairen
´´´
