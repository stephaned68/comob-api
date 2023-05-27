/**
 * Traits routes
 */

const express = require('express');
const router = express.Router();

const traitController = require('../controllers/traitController');

/**
 * Route : /traits/{:dataset}/?race=xxxx
 * Return the racial traits for a given race
 * Route : /traits/{:dataset}/?profile=xxxx
 * Return the special traits for a given profile
 */
router.get('/:ds', traitController.getByType);

module.exports = router;
