/**
 * Base dependencies
 */
const express = require('express');
const cors = require('cors');

const app = express();

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

const { errorHandler } = require('./core/errors');
const mode = process.env.NODE_ENV || 'development';

/**
 * Add the CORS middleware
 */
app.use(cors());

/**
 * Add the helmet middleware
 */
if (mode !== 'development') {
  const helmet = require('helmet');
  app.use(helmet());
}

/**
 * Add the morgan logger middleware
 */
if (mode === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

/**
 * Declare the datasets routes
 */
['/', '/datasets'].forEach(function (path) {
  app.use(path, datasetRoutes);
});

/**
 * Declare the types routes
 */
app.use('/types', typesRoutes);

/**
 * Declare the families routes
 */
app.use('/families', familiesRoutes);

/**
 * Declare the profiles routes
 */
app.use('/profiles', profilesRoutes);

/**
 * Declare the paths routes
 */
app.use('/paths', pathsRoutes);

/**
 * Declare the abilities routes
 */
app.use('/abilities', abilitiesRoutes);

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

/**
 * Declare the error handling routine
 */
app.use(errorHandler);

module.exports = app;
