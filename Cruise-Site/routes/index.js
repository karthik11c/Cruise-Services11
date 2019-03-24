const express = require('express');
const router = express.Router();
const { ensureAuthenticated, issueToken ,verifyToken } = require('../config/auth');
const Db = require('../app');

// Welcome Page

router.get('/', (req, res) => res.render('welcome'));

module.exports = router;
