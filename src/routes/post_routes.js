// post_routes.js in routes folder
const express = require('express');
const adminController = require("../controllers/admin_controller");
const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     description: Adds a new post to a specific category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: string
 *                 description: ID of the post author
 *               content:
 *                 type: string
 *                 description: Content of the post
 *               category:
 *                 type: string
 *                 description: Category to which the post belongs
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Category does not exist or missing data.
 */
router.post('/', adminController.createPost);
router.get('/', adminController.getAllPosts);
router.delete('/:postId', adminController.deletePostById);

module.exports = router;
