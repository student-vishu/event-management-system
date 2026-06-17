const userService = require('../services/user.service');

const userResolvers = {
  Query: {
    me: (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
  },

  Mutation: {
    register: (_, args) => {
      console.log('Registering user with args resolver:', args);
      return userService.register(args);
    },

    login: (_, args) => userService.login(args),

    logout: (_, __, { user, token, tokenExp }) => {
      if (!user) throw new Error('Not authenticated');
      return userService.logout(token, tokenExp);
    },

    changePassword: (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return userService.changePassword(user.id, args);
    },

    resetPassword: (_, { email }) => userService.resetPassword(email),

    updatePassword: (_, args) => userService.updatePassword(args),
  },
};

module.exports = userResolvers;
