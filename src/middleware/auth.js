const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
const User = require('../models/users.model');

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

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.commentId, (err, comment) => {
            if(err || !comment) {
                req.flash('error', '댓글을 찾는 중 에러가 발생');
                res.redirect('back');
            } else { 
                if(comment.author.id.equals(req.user._id)) {
                    req.comment = comment;
                    next();
                } else {
                    req.flash('error', "Permission denied");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash('error', '로그인을 해주세요');
        res.redirect('/login');
    }
}

function checkIsMe(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id, (err, user) => {
            if (err || !user) {
                req.flash('error', '유저를 찾는데 에러가 발생했습니다.');
                res.redirect('/profile/' + req.params.id);
            } else {
                if (user._id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', '권한이 없습니다.');
                    res.redirect('/profile/' + req.params.id);
                }
            }
        })
    } else {
        req.flash('error', '먼저 로그인을 해주세요.');
        res.redirect('/login');
    }
}


module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkPostOwnership,
    checkCommentOwnership,
    checkIsMe
}