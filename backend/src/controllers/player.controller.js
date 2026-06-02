const db = require('../config/db');

exports.getPlayers = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT players.*, teams.name AS team_name, teams.city AS team_city
            FROM players
            LEFT JOIN teams ON players.team_id = teams.id
        `);

        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.createPlayer = async (req, res) => {
    try {
        const { name, position, team_id, age } = req.body;

        await db.query(
            `INSERT INTO players (name, position, team_id, age) VALUES (?, ?, ?, ?)`,
            [name, position, team_id, age]
        );

        res.json({ message: 'Jugador creado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, team_id, age } = req.body;

        await db.query(
            `UPDATE players SET name=?, position=?, team_id=?, age=? WHERE id=?`,
            [name, position, team_id, age, id]
        );

        res.json({ message: 'Jugador actualizado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM players WHERE id=?`, [id]);

        res.json({ message: 'Jugador eliminado' });
    } catch (err) {
        res.status(500).json(err);
    }
};