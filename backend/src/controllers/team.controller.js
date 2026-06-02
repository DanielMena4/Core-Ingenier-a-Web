const db = require('../config/db');

exports.getTeams = async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM teams`);
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.createTeam = async (req, res) => {
    try {
        const { name, city } = req.body;

        await db.query(
            `INSERT INTO teams (name, city) VALUES (?, ?)`,
            [name, city]
        );

        res.json({ message: 'Equipo creado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city } = req.body;

        await db.query(
            `UPDATE teams SET name=?, city=? WHERE id=?`,
            [name, city, id]
        );

        res.json({ message: 'Equipo actualizado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM teams WHERE id=?`, [id]);

        res.json({ message: 'Equipo eliminado' });
    } catch (err) {
        res.status(500).json(err);
    }
};