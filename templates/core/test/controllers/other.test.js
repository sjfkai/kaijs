'use strict';

const assert = require('assert');
const supertest = require('supertest');

const app = require('../../index');

let request;
describe('Other', () => {
  before(() => {
    request = supertest(app.callback());
  });

  describe('GET /', async () => {
    it('should return', async () => {
      const res = await request.get('/')
        .set('Accept', 'application/json')
        .expect(200);
      assert(res.text === 'Hello kaijs');
    });
  });

  describe('Not Found', async () => {
    it('should 404', async () => {
      await request.get('/other/path')
        .set('Accept', 'application/json')
        .expect(404);
    });
  });
});

