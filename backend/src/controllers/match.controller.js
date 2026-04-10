const db = require('../config/db');

exports.getMatches = (req, res) => {
    db.query(`
    SELECT
        m.*,
        ht.name AS home_team_name,
        at.name AS away_team_name
    FROM matches m
    JOIN teams ht ON m.home_team_id = ht.id
    JOIN teams at ON m.away_team_id = at.id
    ORDER BY m.match_date DESC
    `, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.createMatch = (req, res) => {
    const { home_team_id, away_team_id, match_date } = req.body;

    db.query(
        'INSERT INTO matches (home_team_id, away_team_id, match_date) VALUES (?, ?, ?)',
        [home_team_id, away_team_id, match_date],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Partido creado' });
        }
    );
};
exports.updateMatch = (req, res) => {
    const { id } = req.params;
    const { home_team_id, away_team_id, match_date } = req.body;

    db.query(
        `UPDATE matches
        SET home_team_id = ?, away_team_id = ?, match_date = ?
        WHERE id = ?`,
        [home_team_id, away_team_id, match_date, id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Partido actualizado' });
        }
    );
};

exports.deleteMatch = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM matches WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Partido eliminado' });
    });
};