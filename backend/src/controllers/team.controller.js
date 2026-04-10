const db = require('../config/db');

exports.getTeams = (req, res) => {
    db.query('SELECT * FROM teams', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.createTeam = (req, res) => {
    const { name, city } = req.body;

    db.query(
        'INSERT INTO teams (name, city) VALUES (?, ?)',
        [name, city],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Equipo creado' });
        }
    );
};

exports.updateTeam = (req, res) => {
    const { id } = req.params;
    const { name, city } = req.body;

    db.query(
        'UPDATE teams SET name = ?, city = ? WHERE id = ?',
        [name, city, id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Equipo actualizado' });
        }
    );
};

exports.deleteTeam = (req, res) => {
    const { id } = req.params;

    db.query(
        'DELETE FROM teams WHERE id = ?',
        [id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Equipo eliminado' });
        }
    );
};