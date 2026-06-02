const db = require('../config/db');

exports.getLineupDetails = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT
                ld.id,
                ld.lineup_id,
                p.id AS player_id,
                p.name AS player_name,
                p.position,
                t.name AS team_name,
                l.name AS lineup_name
            FROM lineup_details ld
            JOIN players p ON ld.player_id = p.id
            LEFT JOIN teams t ON p.team_id = t.id
            JOIN lineups l ON ld.lineup_id = l.id
        `);

        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.createLineupDetail = async (req, res) => {
    try {
        const { lineup_id, player_id } = req.body;

        await db.query(
            'INSERT INTO lineup_details (lineup_id, player_id) VALUES (?, ?)',
            [lineup_id, player_id]
        );

        res.json({ message: 'Jugador agregado a lineup' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteLineupDetail = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM lineup_details WHERE id=?', [id]);

        res.json({ message: 'Eliminado del lineup' });
    } catch (err) {
        res.status(500).json(err);
    }
};