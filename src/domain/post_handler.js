// src/domain/post_handler.js
const { v4: uuidv4 } = require('uuid');

let posts = [];

exports.createPost = (authorId, content, category) => {
    const post = {
        id: uuidv4(),
        authorId,
        content,
        category,
        reported: false,
        createdAt: new Date()
    };
    posts.push(post);
    return post;
};

exports.getAllPosts = () => {
    return posts;
};

exports.getPostById = (postId) => posts.find(post => post.id === postId);

exports.deletePostById = (postId) => {
    console.log("Attempting to delete post with ID:", postId); // Log postId
    const initialLength = posts.length;
    posts = posts.filter(post => post.id !== postId);
    const deleted = initialLength != posts.length;
    console.log("Post deleted:", deleted); // Log result
    return initialLength !== posts.length;
};

exports.reportPost = (postId, reason) => {
    const post = posts.find(post => post.id === postId);
    if (post) {
        post.reported = true;
        post.reportReason = reason;
        return true;
    }
    return false;
};

exports.getPosts = () => posts;
