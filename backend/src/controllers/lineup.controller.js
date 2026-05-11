const db = require('../config/db');

exports.getLineups = (req, res) => {

    db.query(`
        SELECT 
            lineups.*,
            teams.name AS team_name
        FROM lineups
        JOIN teams ON lineups.team_id = teams.id
    `, (err, results) => {

        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

exports.createLineup = (req, res) => {

    const { name, team_id } = req.body;

    db.query(
        'INSERT INTO lineups (name, team_id) VALUES (?, ?)',
        [name, team_id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Alineación creada'
            });
        }
    );
};

exports.updateLineup = (req, res) => {

    const { id } = req.params;

    const { name, team_id } = req.body;

    db.query(
        'UPDATE lineups SET name=?, team_id=? WHERE id=?',
        [name, team_id, id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Alineación actualizada'
            });
        }
    );
};

exports.deleteLineup = (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM lineups WHERE id=?',
        [id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Alineación eliminada'
            });
        }
    );
};