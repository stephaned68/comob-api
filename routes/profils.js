/**
 * Profiles routes
 */

const { json } = require('express');
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

/**
 * Route: /profiles/{:dataset}/?family=xxxx,xxxx,xxxx&type=xxxx
 * Return list of profiles for a dataset, filtering for :
 *   - an optional comma-separated list of families
 *   - and/or a type of profile
 */
router.get('/:ds', profileController.getFilteredProfiles);

module.exports = router;
