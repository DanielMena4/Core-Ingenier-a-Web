const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const teamRoutes = require('./routes/team.routes');
const matchRoutes = require('./routes/match.routes');

app.use('/api', matchRoutes);
app.use('/api', teamRoutes);
app.use('/api', playerRoutes);
app.use('/api',favoriteRoutes);
app.use('/api', authRoutes);

module.exports = app;