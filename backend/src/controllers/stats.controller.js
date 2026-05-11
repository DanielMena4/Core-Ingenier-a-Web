const db = require('../config/db');

exports.getStats = (req, res) => {

    db.query(`
        SELECT

            stats.*,

            players.name AS player_name,

            home.name AS home_team,
            away.name AS away_team

        FROM stats

        JOIN players
            ON stats.player_id = players.id

        JOIN matches
            ON stats.match_id = matches.id

        JOIN teams home
            ON matches.home_team_id = home.id

        JOIN teams away
            ON matches.away_team_id = away.id
    `,
        (err, results) => {

            if (err) return res.status(500).json(err);

            res.json(results);
        });
};

exports.createStat = (req, res) => {

    const {
        points,
        rebounds,
        assists,
        blocks,
        steals,
        turnovers,
        minutes,
        fouls,
        field_goals_attempted,
        field_goals_made,
        threes_attempted,
        threes_made,
        free_throws_attempted,
        free_throws_made,
        plus_minus,
        player_id,
        match_id
    } = req.body;

    db.query(
        `
        INSERT INTO stats (

            points,
            rebounds,
            assists,
            blocks,
            steals,
            turnovers,
            minutes,
            fouls,
            field_goals_attempted,
            field_goals_made,
            threes_attempted,
            threes_made,
            free_throws_attempted,
            free_throws_made,
            plus_minus,
            player_id,
            match_id

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            points,
            rebounds,
            assists,
            blocks,
            steals,
            turnovers,
            minutes,
            fouls,
            field_goals_attempted,
            field_goals_made,
            threes_attempted,
            threes_made,
            free_throws_attempted,
            free_throws_made,
            plus_minus,
            player_id,
            match_id
        ],

        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Stats creadas'
            });
        }
    );
};

exports.updateStat = (req, res) => {

    const { id } = req.params;

    db.query(
        'UPDATE stats SET ? WHERE id=?',
        [req.body, id],

        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Stats actualizadas'
            });
        }
    );
};

exports.deleteStat = (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM stats WHERE id=?',
        [id],

        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: 'Stats eliminadas'
            });
        }
    );
};