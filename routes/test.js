const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/test', test);

function test(req, res, next) {
    res.send("hello");
}

module.exports = router;