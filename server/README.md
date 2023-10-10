# Server-socketio

### Build docker container

From this directory:

```
docker build -t server-socketio -f server-socketio/Dockerfile .
```

### Run docker container

From this directory (replace DATABASE_URL string with actual connection string):

```
 docker run -p 4001:4001 -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/chess?schema=public" server-socketio
```

### Environment variables:

See src/config/env.ts

# Server-http

### Build docker container

From this directory:

```
docker build -t server-http -f server-http/Dockerfile .
```

### Run docker container

From this directory (replace DATABASE_URL string with actual connection string):

```
 docker run -p 4000:4000 -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/chess?schema=public" server-http
```

### Environment variables 

See src/config.ts
