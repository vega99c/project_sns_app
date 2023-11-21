const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/auth');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');

router.get('/', checkAuthenticated, (req, res) => {
    Post.find()
    .populate('comments')
    .sort({ createdAt: -1 })
    .exec((err, posts) => {
        if(err) {
            console.log("Error occured")
        } else {
            res.render('posts/index', {
                posts: posts,
                currentUser: req.user
            })
        }
    })
})

module.exports = router;