const { gql } = require('graphql-tag');

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type MessageResponse {
    message: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: MessageResponse!
    changePassword(oldPassword: String!, newPassword: String!): MessageResponse!
    resetPassword(email: String!): MessageResponse!
    updatePassword(token: String!, newPassword: String!): MessageResponse!
  }
`;

module.exports = userTypeDefs;
