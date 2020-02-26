/**
 * Base dependencies
 */
const express = require('express');
const app = express();
const cors = require('cors');

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

/**
 * Add the CORS middleware
 */
app.use(cors());

/**
 * Declare the datasets routes
 */
app.use('/datasets', datasetRoutes);

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

module.exports = app;