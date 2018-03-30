'use strict';

const router = require('koa-router')();

const controller = require('../controllers/user');

router.post('/', controller.addUser);
router.get('/:id', controller.getUser);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);

module.exports = router;
