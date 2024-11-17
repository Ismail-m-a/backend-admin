// createPost.js
const { Post } = require('./models'); 

async function createPost() {
  try {
    // authorId from your Users table
    const post = await Post.create({
      authorId: 'fe41988e-7f3e-4d13-816e-360ebf2aec26', 
      content: 'Post content',
      category: 'frontend',
    });

    console.log('Post created:', post.toJSON());
  } catch (error) {
    console.error('Error creating post:', error.message);
  }
}

createPost();
