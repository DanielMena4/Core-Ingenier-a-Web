const db = require('../config/db');
const leagueService = require('./leagueAnalytics.service');

function clamp(n, min = 0, max = 100) {
    if (isNaN(n) || n === null || n === undefined) return 0;
    return Math.max(min, Math.min(max, Number(n)));
}

function safe(n) {
    return Number(n ?? 0);
}

const getPlayerImpactScores = async () => {

    try {

        const league = await leagueService.getLeagueAnalytics();

        if (!league || !league.metrics) {
            throw new Error('League analytics inválido');
        }

        const leagueMap = new Map();
        const metrics = league.metrics;

        Object.keys(metrics).forEach(metricName => {

            const ranking = metrics[metricName].ranking || [];

            ranking.forEach(item => {

                const playerId = Number(item.player_id || item.id);

                if (!leagueMap.has(playerId)) {
                    leagueMap.set(playerId, {
                        player_id: playerId,
                        percentiles: {}
                    });
                }

                leagueMap.get(playerId).percentiles[metricName] =
                    Number(item.percentile || 0);
            });
        });

        const [players] = await db.query(`
            SELECT
                player_id,

                SUM(points) as points,
                SUM(rebounds) as rebounds,
                SUM(assists) as assists,
                SUM(steals) as steals,
                SUM(blocks) as blocks,
                SUM(turnovers) as turnovers,
                SUM(minutes) as minutes,

                SUM(field_goals_made) as fgm,
                SUM(field_goals_attempted) as fga,

                SUM(threes_made) as tpm,
                SUM(threes_attempted) as tpa,

                SUM(free_throws_made) as ftm,
                SUM(free_throws_attempted) as fta

            FROM stats
            GROUP BY player_id
        `);

        if (!players.length) {
            return [];
        }

        const result = players.map(p => {

            const playerId = Number(p.player_id);

            const leaguePlayer = leagueMap.get(playerId);

            if (!leaguePlayer) {
                return {
                    player_id: playerId,
                    impact_score: 0,
                    breakdown: null
                };
            }

            const pct = leaguePlayer.percentiles;

            const fg_pct =
                safe(p.fga) === 0
                    ? 0
                    : safe(p.fgm) / safe(p.fga);

            const three_pct =
                safe(p.tpa) === 0
                    ? 0
                    : safe(p.tpm) / safe(p.tpa);

            const ft_pct =
                safe(p.fta) === 0
                    ? 0
                    : safe(p.ftm) / safe(p.fta);

            const ts_pct =
                (safe(p.fga) + safe(p.fta)) === 0
                    ? 0
                    : safe(p.points) /
                    (
                        2 *
                        (
                            safe(p.fga) +
                            (0.44 * safe(p.fta))
                        )
                    );

            let impact =

                // Producción ofensiva
                safe(pct.points) * 20 +

                // Creación
                safe(pct.assists) * 15 +

                // Rebote
                safe(pct.rebounds) * 12 +

                // Defensa
                safe(pct.steals) * 10 +
                safe(pct.blocks) * 10 +

                // Disponibilidad
                safe(pct.minutes) * 8 +

                // Eficiencia moderna
                (ts_pct * 25);

            // Penalización pérdidas
            impact -= safe(pct.turnovers) * 5;

            impact = clamp(impact);

            return {

                player_id: playerId,

                impact_score: Number(
                    impact.toFixed(2)
                ),

                breakdown: {

                    shooting: {

                        fg_pct: Number(
                            fg_pct.toFixed(3)
                        ),

                        three_pct: Number(
                            three_pct.toFixed(3)
                        ),

                        ft_pct: Number(
                            ft_pct.toFixed(3)
                        ),

                        ts_pct: Number(
                            ts_pct.toFixed(3)
                        )
                    },

                    percentiles: pct,
                }
            };
        });

        return result;

    } catch (err) {

        console.error(
            'Impact Service Error:',
            err
        );

        throw err;
    }
};

module.exports = {
    getPlayerImpactScores
};