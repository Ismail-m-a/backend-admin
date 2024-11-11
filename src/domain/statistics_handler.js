// src/domain/statistics_handler.js
const userHandler = require('./user_handler');
const postHandler = require('./post_handler');

exports.getStatistics = () => {
    return {
        totalUsers: userHandler.getUsers().length,
        totalPosts: postHandler.getPosts().length,
        reportedPosts: postHandler.getPosts().filter(post => post.reported).length,
    };
};
