const { Post } = require('../../models');

exports.createPost = async (authorId, content, category) => {
  return await Post.create({
    authorId,
    content,
    category,
  });
};

exports.getAllPosts = async () => {
  return await Post.findAll();
};

exports.getPostById = async (postId) => {
  return await Post.findByPk(postId);
};

exports.deletePostById = async (postId) => {
  return await Post.destroy({ where: { id: postId } });
};

exports.reportPost = async (postId, reason) => {
  const post = await Post.findByPk(postId);
  if (post) {
    post.reported = true;
    post.reportReason = reason;
    await post.save();
    return post;
  }
  return null;
};
