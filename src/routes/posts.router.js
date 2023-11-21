const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/auth');

router.get('/', checkAuthenticated, (req, res) => {
    res.render('posts');
})

module.exports = router;