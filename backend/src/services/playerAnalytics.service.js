const db = require('../config/db');

class PlayerAnalyticsService {

    async getPlayerAnalytics(playerId) {

        const [rows] = await db.query(
            `SELECT * FROM stats WHERE player_id = ?`,
            [playerId]
        );

        if (!rows.length) {
            return this.emptyResponse();
        }

        const games = rows.length;

        const total = rows.reduce((acc, s) => {

            acc.points += s.points || 0;
            acc.rebounds += s.rebounds || 0;
            acc.assists += s.assists || 0;
            acc.steals += s.steals || 0;
            acc.blocks += s.blocks || 0;
            acc.turnovers += s.turnovers || 0;

            acc.fgm += s.field_goals_made || 0;
            acc.fga += s.field_goals_attempted || 0;

            acc.tpm += s.threes_made || 0;
            acc.tpa += s.threes_attempted || 0;

            acc.ftm += s.free_throws_made || 0;
            acc.fta += s.free_throws_attempted || 0;

            acc.minutes += s.minutes || 0;

            return acc;

        }, {
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            fgm: 0,
            fga: 0,
            tpm: 0,
            tpa: 0,
            ftm: 0,
            fta: 0,
            minutes: 0
        });


        const safeDiv = (a, b) => (b === 0 ? 0 : a / b);

        const avg = (x) => x / games;

        const fg_pct = safeDiv(total.fgm, total.fga);
        const three_pct = safeDiv(total.tpm, total.tpa);
        const ft_pct = safeDiv(total.ftm, total.fta);


        const efficiency =
            total.points +
            total.rebounds * 1.2 +
            total.assists * 1.5 +
            total.steals * 2 +
            total.blocks * 2 -
            total.turnovers * 1.5;

        return {
            player_id: playerId,
            games,

            averages: {
                points: avg(total.points),
                rebounds: avg(total.rebounds),
                assists: avg(total.assists),
                steals: avg(total.steals),
                blocks: avg(total.blocks),
                turnovers: avg(total.turnovers),
                minutes: avg(total.minutes),
            },

            efficiency: {
                score: efficiency,
                per_game: efficiency / games
            },

            shooting: {
                fg_pct,
                three_pct,
                ft_pct
            },

            totals: total
        };
    }

    emptyResponse() {
        return {
            games: 0,
            averages: {},
            efficiency: { score: 0, per_game: 0 },
            shooting: { fg_pct: 0, three_pct: 0, ft_pct: 0 },
            totals: {}
        };
    }
}

module.exports = new PlayerAnalyticsService();