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

        // 1. LEAGUE ANALYTICS
        const league = await leagueService.getLeagueAnalytics();

        if (!league || !league.metrics) {
            throw new Error('League analytics inválido');
        }

        // 2. MAPA DE PERCENTILES POR JUGADOR
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

                const percentileValue = Number(item.percentile);

                leagueMap.get(playerId).percentiles[metricName] =
                    isNaN(percentileValue) ? 0 : percentileValue;
            });
        });

        // 3. STATS AGREGADAS
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
                SUM(threes_attempted) as tpa
            FROM stats
            GROUP BY player_id
        `);

        if (!players || !players.length) {
            return [];
        }

        // 4. CALCULO IMPACT SCORE
        const result = players.map(p => {

            const playerId = Number(p.player_id);
            const l = leagueMap.get(playerId);

            if (!l || !l.percentiles) {
                return {
                    player_id: playerId,
                    impact_score: 0,
                    breakdown: null
                };
            }

            const pct = l.percentiles;

            // shooting
            const fg_pct = p.fga ? safe(p.fgm) / safe(p.fga) : 0;
            const three_pct = p.tpa ? safe(p.tpm) / safe(p.tpa) : 0;

            // IMPACT SCORE
            let impact =
                safe(pct.points) * 0.25 +
                safe(pct.rebounds) * 0.15 +
                safe(pct.assists) * 0.15 +
                safe(pct.steals) * 0.10 +
                safe(pct.blocks) * 0.10 +
                (fg_pct * 100) * 0.10 +
                (three_pct * 100) * 0.10 +
                safe(pct.minutes) * 0.05;

            // penalización turnovers
            impact -= safe(pct.turnovers) * 0.10;

            // FIX FINAL: evitar NaN
            impact = isNaN(impact) ? 0 : impact;

            return {
                player_id: playerId,
                impact_score: Number(clamp(impact).toFixed(2)),

                breakdown: {
                    shooting: {
                        fg_pct: Number(fg_pct.toFixed(3)),
                        three_pct: Number(three_pct.toFixed(3))
                    },
                    percentiles: pct
                }
            };
        });

        return result;

    } catch (err) {
        console.error('Impact Service Error:', err);
        throw err;
    }
};

module.exports = {
    getPlayerImpactScores
};