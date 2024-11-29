const { Post, User } = require('../../models'); 

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { content, category } = req.body;
        const authorId = req.authorId; // ID från middleware

        const newPost = await Post.create({ authorId, content, category });
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

// hämta all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

// radera post by ID
exports.deletePostById = async (req, res) => {
    try {
        const { postId } = req.params; // Extract post ID from route params
        const authorId = req.authorId; // Extracted from `extractUserId` middleware

        console.log("Attempting to delete post with ID:", postId, "by user:", authorId);

        // Fetch the user's role from the database
        const user = await User.findByPk(authorId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log("User role:", user.role);

        // Fetch the post by ID
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        console.log("Post author:", post.authorId, "Requesting user:", authorId);

        // Allow deletion if the user is the author or an admin
        if (post.authorId === authorId || user.role === 'admin') {
            await post.destroy(); // Delete the post
            console.log("Post deleted successfully.");
            return res.status(200).json({ message: 'Post deleted successfully.' });
        } else {
            console.log("Unauthorized deletion attempt by user:", authorId, "Role:", user.role);
            return res.status(403).json({ message: 'Access denied. Only the author or an admin can delete posts.' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Failed to delete post.', error: error.message });
    }
};