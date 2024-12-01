
# GraphQL API with Socket.IO Integration

This project combines a **GraphQL API** with **Socket.IO** to enable real-time communication. It supports creating, updating, and retrieving user data, with **Redis** for caching and **PostgreSQL** for database management.

---

## ✨ Features

- **User Authentication & Authorization**: Secured with JWT tokens.
- **Real-Time Updates**: Real-time user creation and updates powered by Socket.IO.
- **Database Interaction**: Managed with PostgreSQL using Prisma ORM.
- **Efficient Caching**: Leveraging Redis for high-performance caching.
- **Validation & Error Handling**: Robust input validation using Joi and comprehensive error management.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18 or later
- **Docker**: Required for containerized services
- **PostgreSQL**: Database operations
- **Redis**: Caching layer

---

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/tejraval11/graphql-api.git
cd graphql-api
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the root directory with the following content:
```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/user"
JWT_SECRET="your-secret-key"
```

#### 4. Start Services

**Using Docker**:
```bash
docker-compose up
```

- Update `.env` to use the following connection URLs:
  - **PostgreSQL**: `postgres://postgres:root@postgres:5432/user`
  - **Redis**: `redis://redis:6379`

**Local Development**:
1. Start Redis and PostgreSQL locally.
2. Run the application server:
   ```bash
   npm run start:server
   ```
3. Start the Socket.IO client:
   ```bash
   npm run start:client
   ```

---

## 📚 API Documentation

### GraphQL API Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Authentication
All API endpoints require a valid JWT token for authentication. Pass the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Queries and Mutations

#### 1. Create User
**Mutation**:
```graphql
mutation {
  createUser(email: "newuser@example.com", password: "password123") {
    id
    email
    createdAt
    updatedAt
  }
}
```
**Response**:
```json
{
  "data": {
    "createUser": {
      "id": "1",
      "email": "newuser@example.com",
      "createdAt": "2024-12-01T14:00:00.000Z",
      "updatedAt": "2024-12-01T14:00:00.000Z"
    }
  }
}
```

#### 2. Login User
**Mutation**:
```graphql
mutation {
  login(email: "newuser@example.com", password: "password123")
}
```
**Response**:
```json
{
  "data": {
    "login": "<jwt-token>"
  }
}
```

#### 3. Get All Users
**Query**:
```graphql
query {
  users {
    id
    email
    createdAt
    updatedAt
  }
}
```
**Response**:
```json
{
  "data": {
    "users": [
      {
        "id": "1",
        "email": "newuser@example.com",
        "createdAt": "2024-12-01T14:00:00.000Z",
        "updatedAt": "2024-12-01T14:00:00.000Z"
      }
    ]
  }
}
```

#### 4. Update User
**Mutation**:
```graphql
mutation {
  updateUser(id: 1, email: "updateduser@example.com") {
    id
    email
  }
}
```
**Response**:
```json
{
  "data": {
    "updateUser": {
      "id": "1",
      "email": "updateduser@example.com"
    }
  }
}
```

#### 5. Clear All Users
**Mutation**:
```graphql
mutation {
  clearUsers
}
```
**Response**:
```json
{
  "data": {
    "clearUsers": "All users deleted successfully, and ID sequence has been reset."
  }
}
```

### Postman API Collection
A Postman collection is available to simplify API testing. Follow these steps to use it:

1. Open Postman and click on the Import button.
2. Upload the `GraphQL_API_Collection.json` file from the `postman` folder in the repository.
3. Use the collection to test the API endpoints with pre-configured queries and mutations.

---

## 🛠️ Running the Application

### Using Docker
To run the project with Docker:

Start services with Docker Compose:
```bash
docker-compose up --build
```
Access the GraphQL Playground at:
```bash
http://localhost:4000/graphql
```

### Local Development
If you prefer running the application locally:

1. Start Redis and PostgreSQL on your local machine.
2. Start the GraphQL API server:
   ```bash
   npm run start:server
   ```
3. Start the Socket.IO client for testing real-time updates:
   ```bash
   npm run start:client
   ```

---

## 🧪 Testing the Application

Use the Postman collection to test API functionality.

### Verify Real-Time Updates
1. Connect multiple clients to the Socket.IO server.
2. Create or update users and observe the real-time notifications.

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **GraphQL**
- **Socket.IO**
- **Prisma ORM**
- **PostgreSQL**
- **Redis**
- **Joi** for validation
- **JWT** for authentication
