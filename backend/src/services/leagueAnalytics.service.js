const db = require('../config/db');

async function getLeagueAnalytics() {

    const [players] = await db.query(`
        SELECT
            player_id,

            AVG(points) as points,
            AVG(rebounds) as rebounds,
            AVG(assists) as assists,
            AVG(steals) as steals,
            AVG(blocks) as blocks,
            AVG(turnovers) as turnovers,
            AVG(minutes) as minutes,

            AVG(field_goals_made / NULLIF(field_goals_attempted,0)) as fg_pct,
            AVG(threes_made / NULLIF(threes_attempted,0)) as three_pct,
            AVG(free_throws_made / NULLIF(free_throws_attempted,0)) as ft_pct

        FROM stats
        GROUP BY player_id
    `);

    const totalPlayers = players.length;

    const metrics = (key) => {

        const values = players.map(p => Number(p[key] || 0));

        const sum = values.reduce((a,b) => a + b, 0);

        const avg = sum / (values.length || 1);

        const max = Math.max(...values);
        const min = Math.min(...values);

        return {
            avg,
            max,
            min
        };
    };

    const buildRanking = (key) => {

        return [...players]
            .sort((a,b) => (b[key] || 0) - (a[key] || 0))
            .map((p, index) => ({
                player_id: p.player_id,
                value: p[key],
                rank: index + 1,
                percentile: 1 - (index / totalPlayers)
            }));
    };

    return {
        players: totalPlayers,

        metrics: {
            points: {
                ...metrics('points'),
                ranking: buildRanking('points')
            },
            rebounds: {
                ...metrics('rebounds'),
                ranking: buildRanking('rebounds')
            },
            assists: {
                ...metrics('assists'),
                ranking: buildRanking('assists')
            },
            steals: {
                ...metrics('steals'),
                ranking: buildRanking('steals')
            },
            blocks: {
                ...metrics('blocks'),
                ranking: buildRanking('blocks')
            },
            turnovers: {
                ...metrics('turnovers'),
                ranking: buildRanking('turnovers')
            },
            fg_pct: {
                ...metrics('fg_pct'),
                ranking: buildRanking('fg_pct')
            },
            three_pct: {
                ...metrics('three_pct'),
                ranking: buildRanking('three_pct')
            }
        }
    };
}

module.exports = {
    getLeagueAnalytics
};