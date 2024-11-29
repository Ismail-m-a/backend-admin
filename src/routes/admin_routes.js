const express = require('express');
const adminController = require("../controllers/admin_controller");
const { checkAdmin } = require('../middleware/role_middleware');
const { isLoggedIn } = require('../middleware/auth_middleware'); // Import authentication middleware
const router = express.Router();

// Route Definitions

router.post('/users', adminController.createUser);
router.get('/users', isLoggedIn, checkAdmin, adminController.getAllUsers);
router.get('/users/:id', isLoggedIn, adminController.getUser);
router.put('/users/:id', isLoggedIn, checkAdmin, adminController.updateUser);
router.delete('/users/:userId', isLoggedIn, checkAdmin, adminController.deleteUser);

router.post('/groups', isLoggedIn, checkAdmin, adminController.createGroup);
router.get('/groups', isLoggedIn, checkAdmin, adminController.getGroups);
router.delete('/groups/:name', isLoggedIn, checkAdmin, adminController.deleteGroup);

router.post('/users/:id/groups', isLoggedIn, adminController.addUserToGroup);
router.delete('/users/:id/groups/:groupName', isLoggedIn, adminController.removeUserFromGroup);

router.post('/categories', isLoggedIn, checkAdmin, adminController.addCategory);
router.get('/categories', isLoggedIn, adminController.getCategories);
router.delete('/categories/:name', isLoggedIn, checkAdmin, adminController.deleteCategory);

router.get('/statistics', isLoggedIn, checkAdmin, adminController.getForumStatistics);

module.exports = router;
