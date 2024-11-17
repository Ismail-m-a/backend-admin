const { Post } = require('../../models'); 

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
        const { postId } = req.params;
        const authorId = req.authorId; 

        // hitta post och verifiera tillhörande innan deleting
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.authorId !== authorId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
};
