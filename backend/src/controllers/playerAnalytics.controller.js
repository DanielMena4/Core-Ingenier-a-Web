const impactService = require('../services/playerImpact.service');
const db = require('../config/db');

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

        const [statsRows] = await db.query(`
            SELECT 
                SUM(points) as points,
                SUM(rebounds) as rebounds,
                SUM(assists) as assists,
                SUM(steals) as steals,
                SUM(blocks) as blocks,
                SUM(turnovers) as turnovers,
                SUM(minutes) as minutes,
                SUM(field_goals_made) as fgm,
                SUM(field_goals_attempted) as fga,
                SUM(threes_made) as tpm,
                SUM(threes_attempted) as tpa
            FROM stats
            WHERE player_id = ?
        `, [playerId]);

        const stats = statsRows[0];

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
            stats,
            impact
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};