const db = require('../config/db');

exports.getMatches = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT m.*, ht.name AS home_team_name, at.name AS away_team_name
            FROM matches m
            JOIN teams ht ON m.home_team_id = ht.id
            JOIN teams at ON m.away_team_id = at.id
            ORDER BY m.match_date DESC
        `);

        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getMatchById = async (req, res) => {
    try {
        const { id } = req.params;

        const [results] = await db.query(`
            SELECT matches.*, t1.name AS home_team, t2.name AS away_team
            FROM matches
            JOIN teams t1 ON matches.home_team_id = t1.id
            JOIN teams t2 ON matches.away_team_id = t2.id
            WHERE matches.id = ?
        `, [id]);

        res.json(results[0]);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.createMatch = async (req, res) => {
    try {
        const { home_team_id, away_team_id, match_date } = req.body;

        await db.query(
            `INSERT INTO matches (home_team_id, away_team_id, match_date)
            VALUES (?, ?, ?)`,
            [home_team_id, away_team_id, match_date]
        );

        res.json({ message: 'Partido creado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { home_team_id, away_team_id, match_date } = req.body;

        await db.query(
            `UPDATE matches SET home_team_id=?, away_team_id=?, match_date=? WHERE id=?`,
            [home_team_id, away_team_id, match_date, id]
        );

        res.json({ message: 'Partido actualizado' });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteMatch = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM matches WHERE id=?`, [id]);

        res.json({ message: 'Partido eliminado' });
    } catch (err) {
        res.status(500).json(err);
    }
};