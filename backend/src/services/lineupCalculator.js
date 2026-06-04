const { calculateLineupEngine } =
    require('../services/lineupEngine.service');

exports.calculateLineup = async (req, res) => {

    const lineupId = req.params.id;

    const [rows] = await db.query(`
        SELECT player_id FROM lineup_details
        WHERE lineup_id = ?
    `, [lineupId]);

    const playerIds = rows.map(r => r.player_id);

    const result = await calculateLineupEngine({
        playerIds,
        mode: 'BALANCED'
    });

    res.json(result);
};