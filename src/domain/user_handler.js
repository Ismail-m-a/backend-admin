// user_handler.js in domain folder
const { v4: uuidv4 } = require('uuid');
const authHandler = require('./auth_handler');

let users = [
    {
        "id": "d5754271-4ceb-4b28-b2f1-00f2150a931a",
        "username": "said",
        "password": "$2b$10$JeRA02rRS/6PX8RyMPMj8OJHkKI4xY608iGtSHUzD.CQJjEa6YAgm",
        role: "user"
    },
    {
        "id": "472ce839-1ba2-47cf-b6fc-323b1fae5f1d",
        "username": "mona",
        "password": "$2b$10$mp1KZ5A8xgV.Js2Xbwgkm.haiMrZkGHOUt.CmK7VJFpHsTuybyA5W",
        role: "user"
    },
    {
        "id": "574f8c63-4757-4015-8a4a-67e5e74ad79e",
        "username": "jensen",
        "password": "$2b$10$sVhnAZxhnbPFu/UHTpqPdu3kcdE8sasFeyfUp4rBejWx.ODF9O1vq",
        role: "user"
    },
    {   "id": "eb1670c2-479f-4222-8767-e2f9fe81c918",
		"username": "hassan",
		"password": "$2b$10$rdL/CAgaWi2qu8VKRCfoMO3D/a1Vk9lADfeNArvjqwcW2.eqw/VM6",
        role: "admin"
    }
];
let groups = {
    admin: [ '543d719e-da91-429d-bbaa-8010a9556381' ],
    user: [ '543d719e-da91-429d-bbaa-8010a9556381', '543d719e-da91-429d-bbaa-8010a9556382', '543d719e-da91-429d-bbaa-8010a9556383' ],
    gdpr: [ '543d719e-da91-429d-bbaa-8010a9556383' ],
    devforum: []
};


// Example: Call this function when you want to create a new group like "devforum"
// exports.addGroup("devforum");

// Adds user with ID '8944abcb-d501-4a6f-a9b1-46b2bb141c0d' to the "devforum" group
// exports.addUserToGroup('8944abcb-d501-4a6f-a9b1-46b2bb141c0d', 'devforum');



// lagt extra code 
exports.addUser = async (user) => {
    user.id = uuidv4();
    if (!user.password) {
        throw new Error("Password is required to create a user.");
    }
    try {
        user.password = await authHandler.cryptPassword(user.password);
    } catch (error) {
        console.error(`Error encrypting password for user ${user.username}:`, error);
        throw error;
    }
    users.push(user);
    return user;
};


exports.getUser = (id) => {
    return users.find(user => user.id === id);
};


exports.updateUserById = (id, newUserDetails) => {
    let userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users[userIndex] = {...users[userIndex], ...newUserDetails};
        return true;
    }
    return false;
};


exports.deleteUser = (id) => {
    let initialLength = users.length;
    users = users.filter(user => user.id === id);  
    return initialLength !== users.length;
};

exports.addGroup = (groupName) => {
    if (!groups[groupName]) {
        groups[groupName] = [];
        return true;
    }
    return false;
};

exports.listGroups = () => {
    return Object.keys(groups).map(groupName => ({
        name: groupName,
        members: groups[groupName].map(userId =>
            this.getUser(userId)
        )
    }));
};

exports.deleteGroup = (groupName) => {
    if (groups.hasOwnProperty(groupName)) {
        delete groups[groupName];
        return true;
    }
    return false;
};

exports.getUserGroups = (userId) => {
    return Object.keys(groups).filter(groupName => groups[groupName].includes(userId));
};

exports.addUserToGroup = (userId, groupName) => {
    if (!groups[groupName]) {
        console.log("Group does not exist.");
        return false;
    }

    const userExists = users.some(user => user.id === userId);
    if (!userExists) {
        console.log("User does not exist.");
        return false;
    }

    if (groups[groupName].includes(userId)) {
        console.log("User already in the group.");
        return false;
    }

    groups[groupName].push(userId);
    return true;
};


exports.removeUserFromGroup = (userId, groupName) => {
    if (groups[groupName]) {
        let initialLength = groups[groupName].length;
        groups[groupName] = groups[groupName].filter(id => id !== userId);
        return initialLength !== groups[groupName].length;
    }
    return false;
};

exports.getUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

exports.getUsers = () => {
    return users.map(user => ({
        ...user,
        groups: Object.keys(groups).filter(groupName => groups[groupName].includes(user.id))
    }));
};


// ku daray

exports.warnUserById = (userId, warningMessage) => {
    const user = users.find(user => user.id === userId);
    if (user) {
        user.warning = warningMessage; 
        return true;
    }
    return false;
};

exports.blockUserById = (userId) => {
    const user = users.find(user => user.id === userId);
    if (user) {
        user.isBlocked = true; 
        return true;
    }
    return false;
};


exports.getUserById = (id) => {
    return users.find(user => user.id === id);
};
