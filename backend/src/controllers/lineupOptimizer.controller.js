const lineupEngine = require('../services/lineupEngine.service');

exports.getOptimalLineup = async (req, res) => {

    try {

        const teamId = Number(req.params.teamId);

        const mode = (req.query.mode || 'BALANCED').toUpperCase();

        const opponentTeamId = req.query.opponentTeamId
            ? Number(req.query.opponentTeamId)
            : null;

        const playerIds = req.query.playerIds
            ? req.query.playerIds.split(',').map(Number)
            : null;

        const result = await lineupEngine.calculate({
            teamId,
            playerIds,
            mode,
            opponentTeamId
        });

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error generating optimal lineup'
        });
    }
};