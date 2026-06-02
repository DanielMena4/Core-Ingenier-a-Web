const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT
                stats.*,
                players.name AS player_name,
                home.name AS home_team,
                away.name AS away_team
            FROM stats
            JOIN players ON stats.player_id = players.id
            JOIN matches ON stats.match_id = matches.id
            JOIN teams home ON matches.home_team_id = home.id
            JOIN teams away ON matches.away_team_id = away.id
        `);

        res.json(results);

    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * CREATE STAT (con validación de duplicados)
 */
exports.createStat = async (req, res) => {
    try {
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

        // 🔥 VALIDAR DUPLICADO
        const [existing] = await db.query(
            `SELECT id FROM stats WHERE player_id = ? AND match_id = ?`,
            [player_id, match_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'Este jugador ya tiene estadísticas en este partido'
            });
        }

        // 🔥 INSERT
        await db.query(
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
            ]
        );

        res.json({ message: 'Stats creadas' });

    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * UPDATE STAT
 */
exports.updateStat = async (req, res) => {
    try {
        const { id } = req.params;

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
            free_throws_made
        } = req.body;

        // VALIDACIONES
        const stats = [
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
            free_throws_made
        ];

        for (const stat of stats) {
            if (stat < 0) {
                return res.status(400).json({
                    message: 'Las estadísticas no pueden ser negativas'
                });
            }
        }

        if (field_goals_made > field_goals_attempted) {
            return res.status(400).json({
                message: 'FGM no puede ser mayor que FGA'
            });
        }

        await db.query(
            `UPDATE stats SET ? WHERE id = ?`,
            [req.body, id]
        );

        res.json({ message: 'Stats actualizadas' });

    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * DELETE STAT
 */
exports.deleteStat = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            `DELETE FROM stats WHERE id = ?`,
            [id]
        );

        res.json({ message: 'Stats eliminadas' });

    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * GET STATS BY MATCH
 */
exports.getStatsByMatch = async (req, res) => {
    try {
        const { id } = req.params;

        const [results] = await db.query(`
            SELECT
                stats.*,
                players.name AS player_name,
                teams.name AS team_name
            FROM stats
            JOIN players ON stats.player_id = players.id
            LEFT JOIN teams ON players.team_id = teams.id
            WHERE stats.match_id = ?
        `, [id]);

        res.json(results);

    } catch (err) {
        res.status(500).json(err);
    }
};