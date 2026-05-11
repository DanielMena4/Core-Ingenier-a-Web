const db = require('../config/db');

exports.getLineupDetails = (req, res) => {

    db.query(`
        SELECT 
            lineup_details.id,
            lineup_details.lineup_id,

            players.id AS player_id,
            players.name AS player_name,
            players.position,

            teams.name AS team_name,

            lineups.name AS lineup_name

        FROM lineup_details

        JOIN players
            ON lineup_details.player_id = players.id

        LEFT JOIN teams
            ON players.team_id = teams.id

        JOIN lineups
            ON lineup_details.lineup_id = lineups.id
    `,
        (err, results) => {

            if (err) return res.status(500).json(err);

            res.json(results);
        });
};

exports.createLineupDetail = (req, res) => {

    const { lineup_id, player_id } = req.body;

    db.query(
        `
        INSERT INTO lineup_details
        (lineup_id, player_id)
        VALUES (?, ?)
        `,
        [lineup_id, player_id],

        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Jugador agregado a alineación'
            });
        }
    );
};

exports.deleteLineupDetail = (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM lineup_details WHERE id=?',
        [id],

        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Jugador eliminado de alineación'
            });
        }
    );
};