const db = require('../config/db');

exports.addFavorite = (req, res) => {
    const userId = req.userId;
    const { player_id } = req.body;

    db.query(
        'INSERT INTO favorites (user_id, player_id) VALUES (?, ?)',
        [userId, player_id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Agregado a favoritos' });
        }
    );
};

exports.getFavorites = (req, res) => {
    const userId = req.userId;

    db.query(`
    SELECT
        players.*,
        teams.name AS team_name,
        teams.city AS team_city
    FROM favorites
    JOIN players ON favorites.player_id = players.id
    LEFT JOIN teams ON players.team_id = teams.id
    WHERE favorites.user_id = ?
    `, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.removeFavorite = (req, res) => {
    const userId = req.userId;
    const { playerId } = req.params;

    db.query(
        'DELETE FROM favorites WHERE user_id=? AND player_id=?',
        [userId, playerId],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Eliminado de favoritos' });
        }
    );
};