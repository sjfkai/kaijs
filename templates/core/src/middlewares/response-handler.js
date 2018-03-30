'use strict';

const ResponseError = require('../common/response-error');

module.exports = async (ctx, next) => {
  try {
    await next();
    switch (ctx.method.toLowerCase()) {
      case 'get':
        ctx.status = 200;
        break;
      case 'post':
        ctx.status = 201;
        break;
      case 'delete':
      case 'update':
      case 'put':
      case 'patch':
        ctx.status = 204;
        break;
      default:
        ctx.status = 200;
        break;
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      ctx.status = error.status;
      ctx.body = error.message;
      return;
    }
    console.log(error);
    ctx.status = 500;
    ctx.body = 'server unknown error';
  }
};
