/**
 * Abilities routes
 */

const express = require('express');
const router = express.Router();
const abilityController = require('../controllers/abilityController');

/**
 * Routes :
 * /abilities/{:dataset}/?type=xxxxx
 * Return abilities of a given type
 * /abilities/{:dataset}/?profile=xxxxx
 * Return abilities for a given profile
 * /abilities/{:dataset}/?race=xxxxx
 * Return abilities for a given race
 */
router.get('/:ds', abilityController.getFilteredAbilities);

/**
 * Route : /abilities/{:ds}/{:path}
 * Return abilities for a given path
 */
router.get('/:ds/:path', abilityController.getByPath);

module.exports = router;
