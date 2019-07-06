const express = require('express');
const app = express();
const cors = require('cors');

const datasetRoutes = require('./routes/datasets');
const profilRoutes = require('./routes/profils');
const voieRoutes = require('./routes/voies');
const capaciteRoutes = require('./routes/capacites');

app.use(cors());
app.use('/datasets', datasetRoutes);
app.use('/profils', profilRoutes);
app.use('/voies', voieRoutes);
app.use('/capacites', capaciteRoutes);

module.exports = app;