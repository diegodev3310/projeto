# Meu chatbot
## Objetivo
Construir um chatbot para o WhatsApp, que ajude à acelerar e melhorar o atendimento de estabelecimentos.

## Requisitos
Para rodar localmente:
- [NodeJS](https://nodejs.org/pt/download)
- [PostgreSQL](https://www.postgresql.org/download/)

Para rodar com Docker:
- [Docker](https://www.docker.com/)

## Inicializando

### Localmente:

- No Windows:

1. Basta instalar o PostgreSQL
2. Realizar as configurações basicas na interface
3. Acessar o banco de dados via algum SGBD (nativo ou [DBeaver](https://dbeaver.io/))
4. Criar as tabelas contidas no arquivo *init.sql*.

- No Linux:

1. Instale o PostgreSQL, então utilize os comandos:

```
$ sudo -u postgres psql
$ CREATE USER seu_usuario WITH PASSWORD 'sua_senha' LOGIN CREATEDB;
$ CREATE DATABASE nome_do_banco OWNER seu_usuario;
```
Obs: para ``seu_usuario, sua_senha e nome_do_banco``, utilize os mesmos que cadastrar no arquivo .env

2. Então crie as tabelas contidas no arquivo *init.sql*.

Por fim, para ambos, inicialize o projeto com os comandos:
```
$ npm install
$ npm run start
```

### Docker:
Configure o arquivo .env seguindo o .env.example, então execute:
```
$ docker-compose up --build
```
