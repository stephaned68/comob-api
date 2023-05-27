/**
 * Families routes
 */

const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

/**
 * Route: /families/{:dataset}
 * Return list of families for a dataset
 */
router.get('/:ds', familyController.getAllFamilies);

module.exports = router;
