const express = require('express');
const { extractUserId } = require('../middleware/auth_middleware'); 
const postController = require('../controllers/post_controller'); 
const router = express.Router();

// Skapa post - Automatisk använd authorId från middleware
router.post('/', extractUserId, postController.createPost);

// Hämta all posts
router.get('/', postController.getAllPosts);

// Radera post med ID
router.delete('/:postId', extractUserId, postController.deletePostById);

module.exports = router;
