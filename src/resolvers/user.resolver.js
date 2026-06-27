const userService = require('../services/user.service');
const { unauthenticatedError } = require('../utils/errors');

const userResolvers = {
  User: {
    createdAt: (user) => user.created_at ? new Date(user.created_at).toISOString() : null,
    updatedAt: (user) => user.updated_at ? new Date(user.updated_at).toISOString() : null,
  },

  Query: {
    me: (_, __, { user }) => {
      if (!user) throw unauthenticatedError('Not authenticated');
      return user;
    },
  },

  Mutation: {
    register: (_, args) => userService.register(args),

    login: (_, args) => userService.login(args),

    logout: (_, __, { user }) => {
      if (!user) throw unauthenticatedError('Not authenticated');
      return userService.logout(user.token, user.tokenExp);
    },

    changePassword: (_, args, { user }) => {
      if (!user) throw unauthenticatedError('Not authenticated');
      return userService.changePassword(user.id, args);
    },

    resetPassword: (_, { email }) => userService.resetPassword(email),

    updatePassword: (_, args) => userService.updatePassword(args),
  },
};

module.exports = userResolvers;
