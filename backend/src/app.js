const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');
const teamRoutes = require('./routes/team.routes');
const matchRoutes = require('./routes/match.routes');
const lineupRoutes = require('./routes/lineup.routes');
const lineupDetailsRoutes = require('./routes/lineupDetails.routes');
const statsRoutes = require('./routes/stats.routes');

app.use('/api', matchRoutes);
app.use('/api', teamRoutes);
app.use('/api', playerRoutes);
app.use('/api', authRoutes);
app.use('/api',lineupRoutes);
app.use('/api', lineupDetailsRoutes);
app.use('/api', statsRoutes);


module.exports = app;