const db = require('../config/db');
const analyticsService = require('../services/playerAnalytics.service');
const impactService = require('../services/playerImpact.service');


exports.getPlayerAnalytics = async (req, res) => {

    const playerId = Number(req.params.id);

    try {

        const [playerRows] = await db.query(`
            SELECT p.*, t.name as team_name
            FROM players p
            LEFT JOIN teams t ON p.team_id = t.id
            WHERE p.id = ?
        `, [playerId]);

        const player = playerRows[0];

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const analytics = await analyticsService.getPlayerAnalytics(playerId);

        const impactList = await impactService.getPlayerImpactScores();

        const impact = impactList.find(
            p => p.player_id === playerId
        ) || {
            player_id: playerId,
            impact_score: 0,
            breakdown: {
                shooting: {},
                percentiles: {}
            }
        };

        return res.json({
            player,
            analytics,
            impact
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};