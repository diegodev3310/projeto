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

- Inicializando o projeto localmente:

No Windows:

Basta instalar o PostgreSQL, realizar as configurações basicas, acessar o banco de dados via algum SGBD (nativo ou [DBeaver](https://dbeaver.io/)) e criar as tabelas contidas no arquivo *init.sql*.

No Linux:

Instale o PostgreSQL, então utilize os comandos:

```
$ sudo -u postgres psql
$ CREATE USER seu_usuario WITH PASSWORD 'sua_senha' LOGIN CREATEDB;
$ CREATE DATABASE nome_do_banco OWNER seu_usuario;
```
Obs: para ``seu_usuario, sua_senha e nome_do_banco``, utilize os mesmos que cadastrar no arquivo .env

Então crie as tabelas contidas no arquivo *init.sql*.

Inicialize o projeto com os comandos:
```
$ npm install
$ npm run start
```

- Inicializando com Docker:
```
$ docker-compose up --build
```
