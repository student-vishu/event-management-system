const eventService = require('../services/event.service');

const eventResolvers = {
  Query: {
    listEvents: (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return eventService.listEvents(user.id, args);
    },

    eventDetail: (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return eventService.eventDetail(user.id, id);
    },
  },

  Mutation: {
    createEvent: (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return eventService.createEvent(user.id, args);
    },

    updateEvent: (_, { id, ...fields }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return eventService.updateEvent(user.id, id, fields);
    },

    inviteUsers: (_, { eventId, emails }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return eventService.inviteUsers(user.id, eventId, emails);
    },
  },
};

module.exports = eventResolvers;
