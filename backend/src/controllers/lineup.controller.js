const db = require('../config/db');

exports.getLineups = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT lineups.*, teams.name AS team_name
            FROM lineups
            JOIN teams ON lineups.team_id = teams.id
        `);

        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.createLineup = async (req, res) => {
    try {
        const { name, team_id } = req.body;

        await db.query(
            'INSERT INTO lineups (name, team_id) VALUES (?, ?)',
            [name, team_id]
        );

        res.json({ message: 'Lineup creado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateLineup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, team_id } = req.body;

        await db.query(
            'UPDATE lineups SET name=?, team_id=? WHERE id=?',
            [name, team_id, id]
        );

        res.json({ message: 'Lineup actualizado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteLineup = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM lineups WHERE id=?', [id]);

        res.json({ message: 'Lineup eliminado' });
    } catch (err) {
        res.status(500).json(err);
    }
};