# Passo a Passo - Docker Containers

## 1. Construir as imagens

```bash
# Construir imagem do banco
docker build -f Dockerfile.db -t meu-postgres .

# Construir imagem da web
docker build -t minha-web .
```

## 2. Rodar os containers

```bash
# Rodar container do banco (primeiro)
docker run -d --name postgres-container -p 5432:5432 meu-postgres

# Rodar container da web (depois)
docker run -d --name web-container -p 3000:3000 -e DB_HOST=host.docker.internal minha-web
```

## 3. Testar

Acesse: http://localhost:3000

## 4. Parar containers

```bash
docker stop web-container postgres-container
docker rm web-container postgres-container
```