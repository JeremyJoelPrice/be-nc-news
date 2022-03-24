# Northcoders News Backend

This application mimics real world backend services like Reddit, by providing a
REST API, and serving data to, a front end architecture. The API is built in
Node.js, and the database is PSQL.

The hosted version is avaiable here: https://jeremy-nc-news.herokuapp.com/api

---

## Setup

### You Will Need

- Node.js v17.6
- PostgreSQL v14.2
- Node Package Manager (npm)

---

### 1. Clone the repo

```
git clone https://github.com/JeremyJoelPrice/be-nc-news.git
```

---

### 2. Install dependencies.

```
npm install
```

---

### 3. Create two .env files

This project uses `Dotenv` to select the appropriate database depending on
whether we are running the app in a test, development, or production
environment.

`Dotenv` is a zero-dependency module that loads environment variables from a
`.env` file into `process.env`, a Node global object. Normally it would contain confidential information but, for this demo application, you can follow these instructions to create the files we need.

For `Dotenv` to work correctly, we must create two files with the following
content:

Filename: `.env.test`

Content:

```
PGDATABASE=nc_news_test
```

Filename: `.env.development`

Content:

```
PGDATABASE=nc_news
```

---

### 4. Setup local databases

Create local databases

```
npm run setup-dbs
```

Seed local databases

```
npm run seed
```

---

### 5. Launch Application

To run the server locally

```
npm start
```

To run all tests

```
npm test
```
