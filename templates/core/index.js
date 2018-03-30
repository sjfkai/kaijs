'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const router = require('./src/routes');

const app = new Koa();

app.use(bodyParser());

app.use(require('./src/middlewares/response-handler'));

app.use(router.routes());
app.use(router.allowedMethods());


if (!module.parent) {
  const port = 8080;
  app.listen(port);
  console.log(`server started at ${port}`);
}

module.exports = app;
