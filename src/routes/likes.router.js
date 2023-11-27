const express = require('express');
const { checkAuthenticated } = require('../middleware/auth');
const router = express.Router();
const Post = require('../models/posts.model');

router.put("/posts/:id/like", checkAuthenticated, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if(err) {
            req.flash("error", "Post not found");
            res.redirect("/posts");
        } else {
            //이미 좋아요를 누른 경우
            if(post.likes.find(likeId => likeId === req.user._id.toString())) {
                let updatedlikes = post.likes.filter(likeId => 
                    likeId !== req.user._id.toString()
                );
                Post.findByIdAndUpdate(post._id, {
                    likes: updatedlikes
                }, (err, _) => {
                    if(err) {
                        console.log(err);
                        res.redirect("back");
                    } else {
                        res.redirect("back");
                    }
                })
            } else {
                //처음 눌렀을 경우
                Post.findByIdAndUpdate(post._id, {
                    likes: post.likes.concat([req.user._id])
                }, (err, _) => {
                    if(err) {
                        console.log(err);
                        res.redirect("back");
                    } else {
                        res.redirect("back");
                    }
                })
            }            
        }
    })
})

module.exports = router;