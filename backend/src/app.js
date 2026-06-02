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
const playerAnalyticsRoutes = require('./routes/playerAnalytics.routes');
const leagueRoutes = require('./routes/leagueAnalytics.routes');
const playerStylesRoutes = require('./routes/playerStyles.routes');
const impactRoutes = require('./routes/playerImpact.routes');

app.use('/api', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);

app.use('/api/lineups', lineupRoutes);
app.use('/api/lineup-details', lineupDetailsRoutes);

app.use('/api/stats', statsRoutes);

app.use('/api/analytics', playerAnalyticsRoutes);
app.use('/api/league', leagueRoutes);

app.use('/api/styles', playerStylesRoutes);
app.use('/api/impact', impactRoutes);

module.exports = app;