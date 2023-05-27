/**
 * Races routes
 */

const express = require('express');
const router = express.Router();

const raceController = require('../controllers/raceController');

/**
 * Route : /races/{:dataset}/?types=xxxx,xxxx,xxxx
 * Return the races for a given list of types
 */
router.get('/:ds', raceController.getByType);

/**
 * Route : /races/{:dataset}/{:race}
 * Return a race record
 */
router.get('/:ds/:race', raceController.getOne);

module.exports = router;
