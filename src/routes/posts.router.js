const express = require('express');
const router = express.Router();
const { checkAuthenticated, checkPostOwnership } = require('../middleware/auth');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
const multer = require('multer');
const path = require('path');


const storageEngine = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/assets/images'))
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage: storageEngine }).single('image');

router.post('/', checkAuthenticated, upload, (req, res, next) => {
    let desc = req.body.desc;
    let image = req.file ? req.file.filename : "";
    
    Post.create({
        image: image,
        description: desc,
        author: {
            id: req.user.id,
            username: req.user.username
        }
    }, (err, post) => {
        if(err) {
            req.flash('error', '포스트 생성 실패');
            res.redirect("back");
            // next(err);
        } else {
            req.flash('success', '포스트 생성 성공');
            res.redirect("back");
        }
    })   
})

router.get("/:id/edit", checkPostOwnership, (req, res) => {    
    res.render("posts/edit", {
        post: req.post
    })        
})

router.put('/:id', checkPostOwnership, (req,res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, (err, _) => {
        if(err) {
            req.flash('error', '게시물을 수정하는데 오류가 발생했습니다.');
            res.redirect('/posts');            
        } else {
            req.flash('success', '게시물 수정을 완료했습니다,');
            res.redirect('/posts');
        }
    })
})

router.get('/', checkAuthenticated, (req, res) => {
    Post.find()
    .populate('comments')
    .sort({ createdAt: -1 })
    .exec((err, posts) => {
        if(err) {
            console.log(err);
        } else {
            res.render('posts/index', {
                posts: posts,                
            })
        }
    })
})

module.exports = router;