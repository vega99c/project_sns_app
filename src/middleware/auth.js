const Post = require('../models/posts.model');


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/posts');
    }
    next();
}

function checkPostOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        //id 에 맞는 포스트가 존재하는지
        Post.findById(req.params.id, (err, post) => {
            if(err || !post) {
                req.flash('error', 'post not found');
                res.redirect("back");
            } else {
                //내 포스트 인지
                if(post.author.id.equals(req.user._id)) {
                    req.post = post;
                    next();
                } else {
                    req.flash('error', 'Permission denied');
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash('error', 'Please Login first!');
        res.redirect("/login");
    }
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkPostOwnership
}