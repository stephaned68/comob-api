/**
 * Categories routes
 */

const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

/**
 * Route: /categories/{:dataset}
 * Return list of categories for a dataset
 */
router.get('/:ds', categoryController.getAllCategories);

/**
 * Roue: /categories/{:dataset}/{:parent}
 * Return list of sub-categories for a dataset and parent category
 */
router.get('/:ds/:parent', categoryController.getByParent);

module.exports = router;
