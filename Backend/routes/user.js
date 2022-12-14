const express = require('express');

const feedController = require('../controllers/feed');  //TODO 

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', feedController.createPost);

module.exports = router;