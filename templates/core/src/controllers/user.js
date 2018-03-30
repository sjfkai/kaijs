'use strict';

module.exports = {

  async getUser(ctx) {
    ctx.body = {
      id: ctx.params.id,
      name: 'kai',
    };
  },

  async addUser(ctx) {
    ctx.body = {
      id: '222',
      name: ctx.request.body.name,
    };
  },

  async deleteUser(ctx) {
    console.log(`delete user ${ctx.params.id}`);
  },

  async updateUser(ctx) {
    console.log(`delete user ${ctx.params.id}`);
  },

};
