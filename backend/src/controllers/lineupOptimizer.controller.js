const engine = require('../services/lineupEngine.service');

exports.getOptimalLineup = async (req, res) => {

    try {

        const teamId = Number(req.params.teamId);
        const mode = req.query.mode || 'BALANCED';
        const opponentTeamId = req.query.opponentTeamId
            ? Number(req.query.opponentTeamId)
            : null;

        const players =
            await engine.buildPlayerProfiles({
                teamId,
                mode,
                opponentTeamId
            });

        const sorted =
            [...players].sort((a, b) =>
                b.lineup_score - a.lineup_score
            );

        const lineup = [];

        const bestPG = sorted.find(p => p.position === 'PG');
        const bestC = sorted.find(p => p.position === 'C');

        if (bestPG) lineup.push(bestPG);

        if (bestC && !lineup.some(p => p.player_id === bestC.player_id)) {
            lineup.push(bestC);
        }

        for (const p of sorted) {
            if (lineup.length >= 5) break;
            if (lineup.some(x => x.player_id === p.player_id)) continue;
            lineup.push(p);
        }

        const result =
            await engine.calculateLineupEngine({
                playerIds: lineup.map(p => p.player_id),
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