const { generatePlayerStyles } = require('../services/playerStyles.service');
const { getPlayerAnalytics } = require('../services/playerAnalytics.service');
const { getLeagueAnalytics } = require('../services/leagueAnalytics.service');

async function getPlayerStyles(req, res) {

    try {
        const playerId = req.params.id;

        // 1. traer datos del jugador
        const playerAnalytics = await getPlayerAnalytics(playerId);

        // 2. traer datos de la liga
        const leagueAnalytics = await getLeagueAnalytics();

        // 3. generar estilos
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