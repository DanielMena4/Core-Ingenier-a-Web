const { getLeagueAnalytics } = require('../services/leagueAnalytics.service');

async function getLeague(req, res) {
    try {
        const data = await getLeagueAnalytics();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'League analytics error' });
    }
}

module.exports = {
    getLeague
};