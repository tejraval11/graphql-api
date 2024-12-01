export const typeDefs = `
  type User {
    id: Int!
    email: String!
    createdAt: String!  
    updatedAt: String!  
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
    login(email: String!, password: String!): String!
    updateUser(id: Int!, email: String!): User!
    clearUsers: String!
  }
`;
