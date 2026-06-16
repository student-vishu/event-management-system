const { gql } = require('graphql-tag');

const eventTypeDefs = gql`
  type Event {
    id: ID!
    title: String!
    description: String
    date: String!
    location: String
    creatorId: Int!
    createdAt: String
    updatedAt: String
  }

  type InviteResponse {
    email: String!
    status: String!
  }

  type EventListResponse {
    events: [Event!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  extend type Query {
    listEvents(
      page: Int
      limit: Int
      search: String
      sortBy: String
      sortOrder: String
      dateFrom: String
      dateTo: String
    ): EventListResponse!
    eventDetail(id: ID!): Event!
  }

  extend type Mutation {
    createEvent(
      title: String!
      description: String
      date: String!
      location: String
    ): Event!

    updateEvent(
      id: ID!
      title: String
      description: String
      date: String
      location: String
    ): Event!

    inviteUsers(eventId: ID!, emails: [String!]!): [InviteResponse!]!
  }
`;

module.exports = eventTypeDefs;
