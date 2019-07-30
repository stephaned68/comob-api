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