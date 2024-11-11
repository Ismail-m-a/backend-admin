const postHandler = require('../domain/post_handler');
const categoryHandler = require('../domain/category_handler');
const statisticsHandler = require('../domain/statistics_handler');

const {
    addUser, getUserById, updateUserById, deleteUserById, getUsers,
    addGroup, listGroups, deleteGroup,
    addUserToGroup, removeUserFromGroup, getUserByUsername
} = require('../domain/user_handler');

// Create a new user
exports.createUser = async (req, res) => {
    const user = req.body;

    if (!user.password || !user.username) {
        return res.status(400).send({ message: 'Username and password are required.' });
    }

    try {
        const createdUser = await addUser(user);
        res.status(201).send(createdUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ message: 'Error creating user' });
    }
};

// Fetch all users
exports.getAllUsers = (req, res) => {
    try {
        const users = getUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Fetch a specific user by ID
exports.getUser = (req, res) => {
    const id = req.params.id;
    const user = getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
};

// Update user details
exports.updateUser = (req, res) => {
    const id = req.params.id;
    const newUserDetails = req.body;
    if (updateUserById(id, newUserDetails)) {
        res.send('User updated successfully');
    } else {
        res.status(404).send('User not found');
    }
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
    const id = req.params.id;
    if (deleteUserById(id)) {
        res.send('User deleted successfully');
    } else {
        res.status(404).send('User not found');
    }
};

// Add a user to a group
exports.addUserToGroup = (req, res) => {
    const userId = req.params.id;
    const groupName = req.body.groupName;
    if (addUserToGroup(userId, groupName)) {
        res.send(`User added to ${groupName} successfully.`);
    } else {
        res.status(404).send('User or group not found');
    }
};

// Remove a user from a group
exports.removeUserFromGroup = (req, res) => {
    const userId = req.params.id;
    const groupName = req.params.groupName;
    if (removeUserFromGroup(userId, groupName)) {
        res.send(`User removed from ${groupName} successfully.`);
    } else {
        res.status(404).send('User or group not found');
    }
};

// Create a new group
exports.createGroup = (req, res) => {
    const groupName = req.body.groupName;
    if (addGroup(groupName)) {
        res.status(201).send(`Group '${groupName}' created successfully.`);
    } else {
        res.status(400).send('Group already exists.');
    }
};

// Fetch all groups
exports.getGroups = (req, res) => {
    try {
        const groups = listGroups();
        if (!groups || groups.length === 0) {
            return res.status(404).json({ message: "No groups found" });
        }
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: "Error fetching groups" });
    }
};

// Delete a group by name
exports.deleteGroup = (req, res) => {
    const groupName = req.params.name;
    if (deleteGroup(groupName)) {
        res.send(`Group '${groupName}' deleted successfully.`);
    } else {
        res.status(404).send('Group not found');
    }
};

// Create a post
exports.createPost = (req, res) => {
    const { authorId, content, category } = req.body;
    const categoryExists = categoryHandler.getCategories().some(cat => cat.name === category);

    if (!categoryExists) {
        return res.status(400).send({ message: 'Category does not exist' });
    }

    const post = postHandler.createPost(authorId, content, category);
    res.status(201).json(post);
};

// Get all posts
exports.getAllPosts = (req, res) => {
    const posts = postHandler.getAllPosts();
    if (posts.length === 0) {
        return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
};

// Delete a post
exports.deletePostById = (req, res) => { 
    const { postId } = req.params;
    const { userId } = req.body; // Ensure userId is sent in the request body

    // Get the user and post details
    const user = getUserById(userId);
    const post = postHandler.getPostById(postId);

    console.log("Attempting to delete post with ID:", postId); // Log postId
    console.log("User attempting to delete post:", userId, "Role:", user ? user.role : "User not found");

    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if the user is an admin or the author of the post
    if (user && (user.role === 'admin' || post.authorId === userId)) {
        const success = postHandler.deletePostById(postId);
        console.log("Post deleted:", success); // Log if post was deleted successfully
        if (success) {
            return res.status(200).json({ message: 'Post deleted successfully.' });
        } else {
            return res.status(500).json({ message: 'Failed to delete post.' });
        }
    } else {
        console.log("Access denied for user:", userId); // Log access denied
        return res.status(403).json({ message: 'Access denied. You can only delete your own posts.' });
    }
};


// Report a post
exports.reportPost = (req, res) => {
    const { postId, reason } = req.body;
    const success = postHandler.reportPost(postId, reason);
    if (success) {
        res.status(201).json({ message: 'Post reported successfully.' });
    } else {
        res.status(404).json({ message: 'Post not found.' });
    }
};

// Add a category
exports.addCategory = (req, res) => {
    const { name, description } = req.body;
    if (categoryHandler.addCategory(name, description)) {
        res.status(201).json({ message: `Category '${name}' added successfully.` });
    } else {
        res.status(400).json({ message: 'Category already exists.' });
    }
};

// Get all categories
exports.getCategories = (req, res) => {
    res.status(200).json(categoryHandler.getCategories());
};

// Delete a category by name
exports.deleteCategory = (req, res) => {
    const { name } = req.params;
    if (categoryHandler.deleteCategory(name)) {
        res.status(200).json({ message: `Category '${name}' deleted successfully.` });
    } else {
        res.status(404).json({ message: 'Category not found.' });
    }
};

// Get forum statistics
exports.getForumStatistics = (req, res) => {
    res.status(200).json(statisticsHandler.getStatistics());
};
