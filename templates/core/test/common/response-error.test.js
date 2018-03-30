'use strict';

const assert = require('assert');

const ResponseError = require('../../src/common/response-error');

describe('Response Error', () => {
  it('new error', () => {
    const error = new ResponseError(404, 'Not Found');
    assert(error.status === 404);
    assert(error.message === 'Not Found');
    assert(!!error.stack);
  });
});
