// admin_controller.js in controllers folder

const {
    addUser, getUserById, updateUserById, deleteUserById, getUsers,
    addGroup, listGroups, deleteGroup,
    addUserToGroup, removeUserFromGroup, getUserByUsername
} = require('../domain/user_handler');

// admin_controller.js
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


exports.getUser = (req, res) => {
    const id = req.params.id;
    const user = getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
};

exports.updateUser = (req, res) => {
    const id = req.params.id;
    const newUserDetails = req.body;
    if (updateUserById(id, newUserDetails)) {
        res.send('User updated successfully');
    } else {
        res.status(404).send('User not found');
    }
};

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    if (deleteUserById(id)) {
        res.send('User deleted successfully');
    } else {
        res.status(404).send('User not found');
    }
};

exports.addUserToGroup = (req, res) => {
    const userId = req.params.id;
    const groupName = req.body.groupName;
    if (addUserToGroup(userId, groupName)) {
        res.send(`User added to ${groupName} successfully.`);
    } else {
        res.status(404).send('User or group not found');
    }
};

exports.removeUserFromGroup = (req, res) => {
    const userId = req.params.id;
    const groupName = req.params.groupName;
    if (removeUserFromGroup(userId, groupName)) {
        res.send(`User removed from ${groupName} successfully.`);
    } else {
        res.status(404).send('User or group not found');
    }
};

exports.createGroup = (req, res) => {
    const groupName = req.body.groupName;
    if (addGroup(groupName)) {
        res.status(201).send(`Group '${groupName}' created successfully.`);
    } else {
        res.status(400).send('Group already exists.');
    }
};


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

exports.deleteGroup = (req, res) => {
    const groupName = req.params.name;
    if (deleteGroup(groupName)) {
        res.send(`Group '${groupName}' deleted successfully.`);
    } else {
        res.status(404).send('Group not found');
    }
};


exports.findUserByUsername = (username) => {
    const user = getUserByUsername(username);
    if (!user) {
        return null; // or handle the error as appropriate
    }
    return user;
};

exports.findUserByUsername = (req, res) => {
    const username = req.params.username;  // Assuming username comes from the request parameters
    const user = getUserByUsername(username);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json(user);
};

// Redera post by ID, Xusuus halkaan
exports.deletePost = (req, res, next) => { 
    const postId = req.params.postId;
    if (deleteUserById(postId)) {
        res.send('Post deleted successfully');
    } else {
        res.status(404).send('Post not found');
    }
};

// Varna user 
exports.warnUser = (req, res, next) => {
    const userId = req.params.userId; 
    const warning = req.body.warningMessage;
    
    // Varna user by ID
    if (warnUserById (userId, warning)) { 
        // res.send(`User with ID ${userId} has been warned: ${warning}`);
        res.status(200).send('user has been warned');
    } else { 
        res.status(404).send('User not found');
    }
};

// Blockera user By ID
exports.blockUser = (req, res, next) => { 
    const userId = req.params.userId;
    if (blockUserById(userId)) { 
        res.status(200).send('User has been blocked');
    } else { 
        res.status(404).send('User not found');
    }
};

// Add categories 
exports.addCategory = (req, res) => { 
    const { name, description } = req.body;
    if (addCategory(name, description)) {
        res.status(201).send(`Category '${name}' added successfully`);
    } else {
        res.status(400).send('Invalid category data');
    }    
};

// Delete category
exports.deleteCategory = (req, res) => { 
    const name = req.body.name;
    if (deleteCategory(name)) {
        res.status(200).send(`Category '${name}' deleted successfully`);
    } else {
        res.status(404).send('Category not found');
    }
};

// Statistics och aktivitet
exports.getForumStatistics = (req, res) => {
    const stats = calculateStatistics(); // Define this function in a separate file if needed
    res.status(200).json(stats);
};

