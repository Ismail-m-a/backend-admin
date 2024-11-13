const postHandler = require('../domain/post_handler');
const categoryHandler = require('../domain/category_handler');
const statisticsHandler = require('../domain/statistics_handler');

const {
    addUser, getUserById, updateUserById, deleteUserById, getUsers,
    addGroup, listGroups, deleteGroup,
    addUserToGroup, removeUserFromGroup, getUserByUsername
} = require('../domain/user_handler');

// Skapa ny user
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

// Fetcha all users
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

// Fetcha en specifik user by ID
exports.getUser = (req, res) => {
    const id = req.params.id;
    const user = getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
};

// Updatera user detailjer
exports.updateUser = (req, res) => {
    const id = req.params.id;
    const newUserDetails = req.body;
    if (updateUserById(id, newUserDetails)) {
        res.send('User updated successfully');
    } else {
        res.status(404).send('User not found');
    }
};

// Radera user by ID
exports.deleteUser = (req, res) => {
    const id = req.params.id;
    if (deleteUserById(id)) {
        res.send('User deleted successfully');
    } else {
        res.status(404).send('User not found');
    }
};

// Addera user till en grupp
exports.addUserToGroup = (req, res) => {
    const userId = req.params.id;
    const groupName = req.body.groupName;
    if (addUserToGroup(userId, groupName)) {
        res.send(`User added to ${groupName} successfully.`);
    } else {
        res.status(404).send('User or group not found');
    }
};

// Ta bort  user från en group
exports.removeUserFromGroup = (req, res) => {
    const userId = req.params.id;
    const groupName = req.params.groupName;
    if (removeUserFromGroup(userId, groupName)) {
        res.send(`User removed from ${groupName} successfully.`);
    } else {
        res.status(404).send('User or group not found');
    }
};

// Skapa a new group
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

// Radera group med name
exports.deleteGroup = (req, res) => {
    const groupName = req.params.name;
    if (deleteGroup(groupName)) {
        res.send(`Group '${groupName}' deleted successfully.`);
    } else {
        res.status(404).send('Group not found');
    }
};

// Skapa post/inlägg
exports.createPost = (req, res) => {
    const { authorId, content, category } = req.body;
    const categoryExists = categoryHandler.getCategories().some(cat => cat.name === category);

    if (!categoryExists) {
        return res.status(400).send({ message: 'Category does not exist' });
    }

    const post = postHandler.createPost(authorId, content, category);
    res.status(201).json(post);
};

// Hämta all posts
exports.getAllPosts = (req, res) => {
    const posts = postHandler.getAllPosts();
    if (posts.length === 0) {
        return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
};

// Radera en post
exports.deletePostById = (req, res) => { 
    const { postId } = req.params;
    const { userId } = req.body; // Ensure userId is sent in the request body

    // Get user, post detailjer
    const user = getUserById(userId);
    const post = postHandler.getPostById(postId);

    console.log("Attempting to delete post with ID:", postId); // Log postId
    console.log("User attempting to delete post:", userId, "Role:", user ? user.role : "User not found");

    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }

    // Kontrollera användaren är Admin eller user innan radera
    if (user && (user.role === 'admin' || post.authorId === userId)) {
        const success = postHandler.deletePostById(postId);
        console.log("Post deleted:", success); 
        if (success) {
            return res.status(200).json({ message: 'Post deleted successfully.' });
        } else {
            return res.status(500).json({ message: 'Failed to delete post.' });
        }
    } else {
        console.log("Access denied for user:", userId);  
        return res.status(403).json({ message: 'Access denied. You can only delete your own posts.' });
    }
};


// Reportera post
exports.reportPost = (req, res) => {
    const { postId, reason } = req.body;
    const success = postHandler.reportPost(postId, reason);
    if (success) {
        res.status(201).json({ message: 'Post reported successfully.' });
    } else {
        res.status(404).json({ message: 'Post not found.' });
    }
};

// Addera category
exports.addCategory = (req, res) => {
    const { name, description } = req.body;
    if (categoryHandler.addCategory(name, description)) {
        res.status(201).json({ message: `Category '${name}' added successfully.` });
    } else {
        res.status(400).json({ message: 'Category already exists.' });
    }
};

// Hämta alla categories
exports.getCategories = (req, res) => {
    res.status(200).json(categoryHandler.getCategories());
};

// Radera category med name
exports.deleteCategory = (req, res) => {
    const { name } = req.params;
    if (categoryHandler.deleteCategory(name)) {
        res.status(200).json({ message: `Category '${name}' deleted successfully.` });
    } else {
        res.status(404).json({ message: 'Category not found.' });
    }
};

// Hämta statistics. obs!1 inte färdig
exports.getForumStatistics = (req, res) => {
    res.status(200).json(statisticsHandler.getStatistics());
};
