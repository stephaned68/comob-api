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
const familiesRoutes = require('./routes/familles');
const profilesRoutes = require('./routes/profils');
const pathsRoutes = require('./routes/voies');
const abilitiesRoutes = require('./routes/capacites');

/**
 * Add the CORS middleware
 */
app.use(cors());

/**
 * Declare the datasets route
 */
app.use('/datasets', datasetRoutes);

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
 * Declare the abilities route
 */
[
  '/capacites',
  '/abilities'
].forEach(function (path) {
  app.use(path, abilitiesRoutes);
});

module.exports = app;