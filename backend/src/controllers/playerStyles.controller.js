const { generatePlayerStyles } = require('../services/playerStyles.service');
const { getPlayerAnalytics } = require('../services/playerAnalytics.service');
const { getLeagueAnalytics } = require('../services/leagueAnalytics.service');

async function getPlayerStyles(req, res) {

    try {
        const playerId = req.params.id;

        const playerAnalytics = await getPlayerAnalytics(playerId);

        const leagueAnalytics = await getLeagueAnalytics();

        const result = generatePlayerStyles(playerAnalytics, leagueAnalytics);

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating player styles' });
    }
}

module.exports = {
    getPlayerStyles
};