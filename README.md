# FormApp Frontend

## Getting Started

First, install the dependencies:

```bash
npm install
```

Second, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Form API

This is an API for creating and managing forms, where users can create custom forms, save their data, and retrieve existing forms. The project is built with Fastify, Prisma, PostgreSQL, and Docker.

## Technologies Used

- Fastify (Backend)
- Prisma (ORM)
- PostgreSQL (Database)
- Docker (For service setup)
- TypeScript (Development Language)

## Requirements

- Docker
- Node.js (Preferably version 16 or higher)
- PostgreSQL (Optional, as Docker is used to set up the database)

## Setting up the Database with Docker

1. Make sure you have Docker and Docker Compose installed on your machine.
2. In the root of the project, run the following command to start the PostgreSQL container:

   ```bash
   docker-compose up -d
   ```

   This command will:

   - Start the PostgreSQL container using the configuration from the `docker-compose.yml` file.
   - The database will run on port `5432` on your local machine.

## Environment Configuration

1. Create a `.env` file in the root of the project with the following content:

   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
   ```

   Replace `username` and `password` with your PostgreSQL credentials. If you're using Docker Compose to run the database, the username and password are defined in `docker-compose.yml`.

2. Make sure the `.env` file is loaded by your application. Fastify and Prisma will automatically load the environment variables.

3. run `npx prisma migrate dev --name init`

4. run the command `npx prisma generate`

## Ports

- **API Port**: The API runs on port `3001` by default.

  You can access the API at `http://localhost:3001`.


## API Endpoints

### 1. Create a Form

- **Method**: POST
- **URL**: `/api/forms`
- **Request Body**:

  ```json
  {
    "name": "Example Form",
    "fields": [
      {
        "type": "text",
        "question": "What is your name?",
        "required": true
      },
      {
        "type": "boolean",
        "question": "Do you like ice cream?",
        "required": false
      }
    ]
  }
  ```

- **Response**:

  ```json
  {
    "id": 1,
    "name": "Example Form",
    "fields": [
      {
        "type": "text",
        "question": "What is your name?",
        "required": true
      },
      {
        "type": "boolean",
        "question": "Do you like ice cream?",
        "required": false
      }
    ],
    "createdAt": "2023-09-30T10:00:00Z"
  }
  ```

- **cURL Command**:

  ```bash
  curl -X POST http://localhost:3000/api/forms \
    -H "Content-Type: application/json" \
    -d '{"name":"Example Form","fields":[{"type":"text","question":"What is your name?","required":true},{"type":"boolean","question":"Do you like ice cream?","required":false}]}'
  ```

### 2. Get a Form by ID

- **Method**: GET
- **URL**: `/api/forms/{id}`
- **Response**:

  ```json
  {
    "id": 1,
    "name": "Example Form",
    "fields": [
      {
        "type": "text",
        "question": "What is your name?",
        "required": true
      },
      {
        "type": "boolean",
        "question": "Do you like ice cream?",
        "required": false
      }
    ],
    "createdAt": "2023-09-30T10:00:00Z"
  }
  ```

- **cURL Command**:

  ```bash
  curl http://localhost:3000/api/forms/1
  ```

### 3. Get List of Forms

- **Method**: GET
- **URL**: `/api/forms`
- **Response**:

  ```json
  [
    {
      "id": 1,
      "name": "Example Form",
      "fields": [
        {
          "type": "text",
          "question": "What is your name?",
          "required": true
        },
        {
          "type": "boolean",
          "question": "Do you like ice cream?",
          "required": false
        }
      ],
      "createdAt": "2023-09-30T10:00:00Z"
    }
  ]
  ```

- **cURL Command**:

  ```bash
  curl http://localhost:3000/api/forms
  ```

### 4. Save Form Data

- **Method**: POST
- **URL**: `/api/forms/{id}`
- **Request Body**:

  ```json
  {
    "userData": {
      "What is your name?": "John Doe",
      "Do you like ice cream?": "true"
    }
  }
  ```

- **Response**:

  ```json
  {
    "id": 1,
    "formId": 1,
    "data": {
      "What is your name?": "John Doe",
      "Do you like ice cream?": "true"
    },
    "createdAt": "2023-09-30T10:05:00Z"
  }
  ```

- **cURL Command**:

  ```bash
  curl -X POST http://localhost:3000/api/forms/1/data \
    -H "Content-Type: application/json" \
    -d '{"userData":{"What is your name?":"John Doe","Do you like ice cream?":"true"}}'
  ```

---

