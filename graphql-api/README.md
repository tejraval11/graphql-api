## GraphQL API Endpoints

### Queries

#### users
- **Description**: Fetches all users.
- **Response**: Returns a list of users with `id`, `email`, `createdAt`, and `updatedAt`.

### Mutations

#### createUser
- **Description**: Creates a new user.
- **Arguments**: `email` (String), `password` (String).
- **Response**: Returns the created user.

#### login
- **Description**: Logs in a user and returns a JWT token.
- **Arguments**: `email` (String), `password` (String).
- **Response**: Returns a JWT token.

#### updateUser
- **Description**: Updates the email of an existing user.
- **Arguments**: `id` (ID), `email` (String).
- **Response**: Returns the updated user.

#### clearUsers
- **Description**: Clears all users from the database.
- **Response**: Returns a success message.

### Real-Time Events (Socket.IO)
- **newUser**: Broadcasted when a new user is created.
- **userUpdated**: Broadcasted when a user is updated.
