/**
 * Base dependencies
 */
const express = require('express');
const app = express();
const cors = require('cors');
const colors = require('colors');

/**
 * Router modules
 */
const datasetRoutes = require('./routes/datasets');
const typesRoutes = require('./routes/types');
const familiesRoutes = require('./routes/familles');
const profilesRoutes = require('./routes/profils');
const pathsRoutes = require('./routes/voies');
const abilitiesRoutes = require('./routes/capacites');
const categoriesRoutes = require('./routes/categories');
const equipmentRoutes = require('./routes/equipements');
const racesRoutes = require('./routes/races');
const traitsRoutes = require('./routes/traits');

const mode = process.env.NODE_ENV || 'development';

/**
 * Add the CORS middleware
 */
app.use(cors());

/**
 * Add the morgan logger middleware
 */
if (mode === 'development') {
  const morgan = require('morgan');
  app.use(morgan('combined'));
}

/**
 * Declare the datasets routes
 */
[
  '/',
  '/datasets'
].forEach(function (path) {
  app.use(path, datasetRoutes);
});

/**
 * Declare the types routes
 */
app.use('/types', typesRoutes);

/**
 * Declare the families routes
 */
[
  '/familles',
  '/families'
].forEach(function (path) {
  app.use(path, familiesRoutes);
});

/**
 * Declare the profiles routes
 */
[
  '/profils',
  '/profiles'
].forEach(function (path) {
  app.use(path, profilesRoutes);
});

/**
 * Declare the paths routes
 */
[
  '/voies',
  '/paths'
].forEach(function (path) {
  app.use(path, pathsRoutes);
});

/**
 * Declare the abilities routes
 */
[
  '/capacites',
  '/abilities'
].forEach(function (path) {
  app.use(path, abilitiesRoutes);
});

/**
 * Declare the categories routes
 */
app.use('/categories', categoriesRoutes);

/**
 * Declare the equipments routes
 */
app.use('/equipments', equipmentRoutes);

/**
 * Declare the races routes
 */
app.use('/races', racesRoutes);

/**
 * Declare the traits routes
 */
app.use('/traits', traitsRoutes);

module.exports = app;