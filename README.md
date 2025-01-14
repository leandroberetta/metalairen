# MetaLairen

## Desarrollo

### Instalación de dependencias

```bash
npm install
npx prisma generate
```

### Creación de base de datos

```bash
docker run -d \
  --name metalairen-db \
  -e POSTGRES_USER=metalairen \
  -e POSTGRES_PASSWORD=metalairen \
  -e POSTGRES_DB=metalairen \
   -v ./dump.sql:/docker-entrypoint-initdb.d/dump.sql:z \
  -p 5432:5432 \
  postgres:latest
```

### Despliegue estático

Ejecutar los siguientes pasos (es necesario tener la base de datos levantada):

```bash
npm run build

docker build -t metalairen .
docker run -p 8080:80 8443:443 --name metalairen metalairen
```

### Generación de backup de base de datos

```bash
docker exec -t metalairen-db pg_dump -U metalairen metalairen > dump.sql
```