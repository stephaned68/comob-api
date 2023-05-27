/**
 * Paths routes
 */

const express = require('express');
const router = express.Router();
const pathController = require('../controllers/pathController');

/**
 * Route : /paths/{:dataset}/?type=xxxxx
 * Return the paths for a given special type
 */
router.get('/:ds', pathController.getByType);

/**
 * Route : /paths/{:dataset}/{:profile}
 * Return paths for a profile
 * Route : /paths/{:dataset}/{:profile}/?abilities
 * Return abilities detailed by paths for a profile
 */
router.get('/:ds/:profile', pathController.getByProfile);

module.exports = router;
