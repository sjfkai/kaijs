'use strict';

const router = require('koa-router')();

const ResponseError = require('../common/response-error');

router.get('/', (ctx) => {
  ctx.body = 'Hello kaijs';
});

router.use('/users', require('./user').routes());

router.all('*', () => {
  throw new ResponseError(404, 'Not Fond!');
});

module.exports = router;
