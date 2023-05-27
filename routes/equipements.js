/**
 * Equipment routes
 */

const express = require("express");
const router = express.Router();

const equipmentController = require('../controllers/equipmentController');

/**
 * Route : /equipments/{:dataset}/?profile=xxxx
 * Return the base equipment for a given profile
 */
router.get("/:ds", equipmentController.getByProfile);

/**
 * Route : /equipments/{:dataset}/{:subcategory}
 * Return the equipments for a given subcategory
 */
router.get("/:ds/:category", equipmentController.getBySubCategory);

module.exports = router;
