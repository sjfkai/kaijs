'use strict';

const assert = require('assert');
const supertest = require('supertest');

const app = require('../../index');

let request;
describe('User', () => {
  before(() => {
    request = supertest(app.callback());
  });

  describe('GET /users/:id', async () => {
    it('should return user', async () => {
      const res = await request.get('/users/111')
        .set('Accept', 'application/json')
        .expect(200);
      assert(res.body.id === '111');
    });
  });

  describe('POST /users', async () => {
    it('should create a new user', async () => {
      const user = {
        name: 'kai2',
      };
      const res = await request.post('/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect(201);
      assert(res.body.name === user.name);
      assert(!!res.body.id);
    });
  });

  describe('PUT /users/:id', async () => {
    it('should update user', async () => {
      const user = {
        name: 'kai222',
      };
      await request.put('/users/222')
        .send(user)
        .set('Accept', 'application/json')
        .expect(204);
    });
  });

  describe('DELETE /users/:id', async () => {
    it('should delete user', async () => {
      await request.delete('/users/222')
        .set('Accept', 'application/json')
        .expect(204);
    });
  });
});

