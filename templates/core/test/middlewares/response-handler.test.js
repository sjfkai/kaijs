'use strict';

const assert = require('assert');

const responseHandler = require('../../src/middlewares/response-handler');
const ResponseError = require('../../src/common/response-error');

describe('response Handler', () => {
  describe('success response', () => {
    it('default response', async () => {
      const ctx = {
        method: 'other',
      };
      const next = async () => {};
      await responseHandler(ctx, next);
      assert(ctx.status === 200);
    });

    it('GET response', async () => {
      const ctx = {
        method: 'get',
      };
      const next = async () => {};
      await responseHandler(ctx, next);
      assert(ctx.status === 200);
    });

    it('POST response', async () => {
      const ctx = {
        method: 'post',
      };
      const next = async () => {};
      await responseHandler(ctx, next);
      assert(ctx.status === 201);
    });

    it('PUT response', async () => {
      const ctx = {
        method: 'put',
      };
      const next = async () => {};
      await responseHandler(ctx, next);
      assert(ctx.status === 204);
    });

    it('DELETE response', async () => {
      const ctx = {
        method: 'delete',
      };
      const next = async () => {};
      await responseHandler(ctx, next);
      assert(ctx.status === 204);
    });

    it('PATCH response', async () => {
      const ctx = {
        method: 'patch',
      };
      const next = async () => {};
      await responseHandler(ctx, next);
      assert(ctx.status === 204);
    });
  });

  describe('error response', () => {
    it('ResponseError response', async () => {
      const ctx = {
        method: 'patch',
      };
      const next = async () => {
        throw new ResponseError(404, 'Not Found');
      };
      await responseHandler(ctx, next);
      assert(ctx.status === 404);
    });

    it('Error response', async () => {
      const ctx = {
        method: 'patch',
      };
      const next = async () => {
        throw new Error();
      };
      await responseHandler(ctx, next);
      assert(ctx.status === 500);
    });
  });
});
