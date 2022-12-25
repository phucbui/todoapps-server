const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const verifyToken = require('../middleware/auth');


// @route GET api/posts
// @desc GET posts
// @access Private
router.get('/', verifyToken, async(req, res) => {

    try {
        console.log(req.userId);
        const posts = await Post.find({user: req.userId}).populate('user', ['username']);

        res.json({success: true, message: 'Happy learning!', posts});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async(req, res) => {
    const {title, description, url, status} = req.body;
    console.log(`title ${title}`);
    // simple validation
    if(!title) {
        return res.status(400).json({success:false, message:'Title is required!'});
    }

    try {
        const newPost = new Post({title, description: description || '', url: (url.startsWith('https://')? url : `https://${url}`) || '', status: status || 'TO LEARN', user: req.userId});
        await newPost.save();

        res.json({success: true, message: 'Happy learning!', post: newPost});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
});

// @route PUT api/posts
// @desc Update post
// @access Private
router.put('/:id', verifyToken, async(req, res) => {
    const {title, description, url, status} = req.body;

    // simple validation
    if(!title) {
        return res.status(400).json({success:false, message:'Title is required!'});
    }

    try {
        let updatedPost = {title, description: description || '', url: (url.startsWith('https://')? url : `https://${url}`) || '', status: status || 'TO LEARN', user: req.userId};
        const postUpdatedCondition = {_id: req.params.id, user: req.userId};
        updatedPost = await Post.findByIdAndUpdate(postUpdatedCondition, updatedPost, {new:true});

        // User not authorized to update post or Post not found
        if(!updatedPost) {
            res.status(401).json({success: fail, message:'User not authorized to update post or Post not found'});
        }

        res.json({success: true, message: 'Excellent!', post: updatedPost});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async(req, res) => {

    try {
        const postDeleteCondition = {_id: req.params.id, user: req.userId};
        deletePost = await Post.findByIdAndDelete(postDeleteCondition, {new:true});

        // User not authorized to update post or Post not found
        if(!deletePost) {
            res.status(401).json({success: fail, message:'User not authorized to update post or Post not found'});
        }

        res.json({success: true, message: 'Excellent!', post: deletePost});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:'Internal Server Error'});
    }
});


module.exports = router;