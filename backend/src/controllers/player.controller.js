const db = require('../config/db');

exports.getPlayers = (req, res) => {
    db.query(`
    SELECT players.*, teams.name AS team_name
    FROM players
    LEFT JOIN teams ON players.team_id = teams.id`,
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
};

exports.createPlayer = (req, res) => {
    const { name, position, team_id } = req.body;

    db.query(
        'INSERT INTO players (name, position, team_id) VALUES (?, ?, ?)',
        [name, position, team_id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Jugador creado' });
        }
    );
};

exports.updatePlayer = (req, res) => {
    const { id } = req.params;
    const { name, position, team_id } = req.body;

    db.query(
        'UPDATE players SET name=?, position=?, team_id=? WHERE id=?',
        [name, position, team_id, id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Jugador actualizado' });
        }
    );
};

exports.deletePlayer = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM players WHERE id=?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Jugador eliminado' });
    });
};