'use strict';

class ResponseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.stack = (new Error()).stack;
  }
}

module.exports = ResponseError;
