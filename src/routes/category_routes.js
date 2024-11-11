// category_routes.js in routes folder
const express = require('express');
const adminController = require("../controllers/admin_controller");
const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Add a new category
 *     description: Creates a new category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *               description:
 *                 type: string
 *                 description: Description of the category
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Category already exists or missing data.
 */
router.post('/', adminController.addCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieves all categories.
 *     responses:
 *       200:
 *         description: List of all categories.
 */
router.get('/', adminController.getCategories);

/**
 * @swagger
 * /api/categories/{name}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a specific category by name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the category to delete.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       404:
 *         description: Category not found.
 */
router.delete('/:name', adminController.deleteCategory);

module.exports = router;
