const { GraphQLError } = require('graphql');

const unauthenticatedError = (message) => new GraphQLError(message, {
  extensions: { code: 'UNAUTHENTICATED' },
});

const forbiddenError = (message) => new GraphQLError(message, {
  extensions: { code: 'FORBIDDEN' },
});

const notFoundError = (message) => new GraphQLError(message, {
  extensions: { code: 'NOT_FOUND' },
});

const badUserInputError = (message) => new GraphQLError(message, {
  extensions: { code: 'BAD_USER_INPUT' },
});

const internalError = (message) => new GraphQLError(message, {
  extensions: { code: 'INTERNAL_SERVER_ERROR' },
});

module.exports = {
  unauthenticatedError,
  forbiddenError,
  notFoundError,
  badUserInputError,
  internalError,
};
