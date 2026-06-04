const db = require('../config/db');
const { calculateLineupEngine } = require('../services/lineupEngine.service');

exports.calculateLineup = async (req, res) => {

    try {

        const lineupId = Number(req.params.id);

        const mode = req.query.mode || 'BALANCED';

        const opponentTeamId = req.query.opponentTeamId
            ? Number(req.query.opponentTeamId)
            : null;

        const [rows] = await db.query(`
            SELECT player_id
            FROM lineup_details
            WHERE lineup_id = ?
        `, [lineupId]);

        const playerIds = rows.map(r => r.player_id);

        const result = await calculateLineupEngine({
            playerIds,
            mode,
            opponentTeamId
        });

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating lineup' });
    }
};
exports.getLineups = async (req, res) => {

    const [rows] = await db.query(`
        SELECT l.*, t.name AS team_name
        FROM lineups l
        LEFT JOIN teams t ON t.id = l.team_id
        WHERE l.user_id = ?
    `, [req.user.id]);

    res.json(rows);
};

exports.getLineupById = async (req, res) => {

    const { id } = req.params;

    const [[lineup]] = await db.query(`
        SELECT * FROM lineups
        WHERE id = ? AND user_id = ?
    `, [id, req.user.id]);

    if (!lineup) {
        return res.status(404).json({ message: 'Not found' });
    }

    const [selectedPlayers] = await db.query(`
        SELECT p.*
        FROM lineup_details ld
        JOIN players p ON p.id = ld.player_id
        WHERE ld.lineup_id = ?
    `, [id]);

    const [allTeamPlayers] = await db.query(`
        SELECT *
        FROM players
        WHERE team_id = ?
    `, [lineup.team_id]);

    const selectedIds = new Set(selectedPlayers.map(p => p.id));

    const availablePlayers = allTeamPlayers.filter(
        p => !selectedIds.has(p.id)
    );

    res.json({
        lineup,
        players: selectedPlayers,
        availablePlayers
    });
};

exports.createLineup = async (req, res) => {

    const { name, team_id } = req.body;

    const [result] = await db.query(`
        INSERT INTO lineups (name, team_id, user_id)
        VALUES (?, ?, ?)
    `, [name, team_id, req.user.id]);

    res.json({ id: result.insertId });
};

exports.updateLineup = async (req, res) => {

    const { id } = req.params;
    const { name, team_id } = req.body;

    await db.query(`
        UPDATE lineups
        SET name = ?, team_id = ?
        WHERE id = ? AND user_id = ?
    `, [name, team_id, id, req.user.id]);

    res.json({ message: 'updated' });
};

exports.deleteLineup = async (req, res) => {

    const { id } = req.params;

    await db.query(`DELETE FROM lineup_details WHERE lineup_id = ?`, [id]);
    await db.query(`DELETE FROM lineups WHERE id = ? AND user_id = ?`, [id, req.user.id]);

    res.json({ message: 'deleted' });
};

exports.addPlayerToLineup = async (req, res) => {

    const { id } = req.params;
    const { player_id } = req.body;

    await db.query(`
        INSERT INTO lineup_details (lineup_id, player_id)
        VALUES (?, ?)
    `, [id, player_id]);

    res.json({ message: 'added' });
};

exports.removePlayerFromLineup = async (req, res) => {

    const { id, playerId } = req.params;

    await db.query(`
        DELETE FROM lineup_details
        WHERE lineup_id = ? AND player_id = ?
    `, [id, playerId]);

    res.json({ message: 'removed' });
};