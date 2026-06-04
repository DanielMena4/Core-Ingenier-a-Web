const db = require('../config/db');

const impactService = require('./playerImpact.service');
const leagueService = require('./leagueAnalytics.service');
const playerAnalyticsService = require('./playerAnalytics.service');
const styleEngine = require('./playerStyles.service');


function getStyleMultiplier(styles = [], mode = 'BALANCED') {

    const rules = {
        OFFENSIVE: {
            Scorer: 0.10,
            Shooter: 0.10,
            Playmaker: 0.08,
            'Efficient Scorer': 0.05
        },
        DEFENSIVE: {
            'Defensive Anchor': 0.12,
            Rebounder: 0.10,
            'Rim Protector': 0.10,
            'Perimeter Defender': 0.08
        },
        VS_INTERIOR: {
            'Defensive Anchor': 0.18,
            Rebounder: 0.15,
            'Rim Protector': 0.12,
            'Perimeter Defender': 0.05
        },
        VS_EXTERIOR: {
            Shooter: 0.15,
            Playmaker: 0.12,
            'Perimeter Defender': 0.15,
            'Efficient Scorer': 0.08
        },
        BALANCED: {
            Scorer: 0.05,
            Shooter: 0.05,
            Playmaker: 0.05,
            'Defensive Anchor': 0.05,
            Rebounder: 0.05,
            'All-Around': 0.05
        }
    };

    const modeRules = rules[mode] || rules.BALANCED;

    let multiplier = 1;


    for (const style of styles) {
        if (modeRules[style]) {
            multiplier += modeRules[style];
        }
    }

    return multiplier;
}

function calculateSynergyBonus(lineup) {

    const styles = lineup.flatMap(p => p.styles || []);

    let bonus = 0;

    if (styles.includes('Scorer') && styles.includes('Playmaker')) bonus += 12;
    if (styles.includes('Playmaker') && styles.includes('Shooter')) bonus += 20;
    if (styles.includes('Scorer') && styles.includes('Shooter')) bonus += 15;
    if (styles.includes('Defensive Anchor') && styles.includes('Rebounder')) bonus += 10;
    if (styles.includes('Rim Protector') && styles.includes('Rebounder')) bonus += 10;

    return bonus;
}

function calculateCompositionPenalty(lineup) {

    const positions = {};

    for (const p of lineup) {
        positions[p.position] = (positions[p.position] || 0) + 1;
    }

    let penalty = 0;

    for (const count of Object.values(positions)) {
        if (count >= 4) penalty += 15;
        else if (count === 3) penalty += 8;
    }

    return penalty;
}


async function buildPlayerProfiles({ teamId = null, playerIds = null, mode }) {

    const league = await leagueService.getLeagueAnalytics();
    const impacts = await impactService.getPlayerImpactScores();

    const impactMap = new Map(
        impacts.map(p => [Number(p.player_id), p])
    );

    let players = [];

    if (teamId) {
        const [rows] = await db.query(
            `SELECT id, name, position FROM players WHERE team_id = ?`,
            [teamId]
        );
        players = rows;
    }

    if (playerIds) {
        const [rows] = await db.query(
            `SELECT id, name, position FROM players WHERE id IN (?)`,
            [playerIds]
        );
        players = rows;
    }

    const profiles = [];

    for (const player of players) {

        const [analytics, impact] = await Promise.all([
            playerAnalyticsService.getPlayerAnalytics(player.id),
            impactMap.get(player.id)
        ]);

        const styleData =
            styleEngine.generatePlayerStyles(analytics, league);

        const impactScore = Number(impact?.impact_score || 0);

        const multiplier =
            getStyleMultiplier(styleData.styles, mode);

        const lineupScore = impactScore * multiplier;

        profiles.push({
            player_id: player.id,
            name: player.name,
            position: player.position,
            impact_score: impactScore,
            styles: styleData.styles,
            multiplier,
            lineup_score: Number(lineupScore.toFixed(2))
        });
    }

    return profiles;
}


async function calculateLineupEngine({
    teamId = null,
    playerIds = null,
    opponentTeamId = null,
    mode = 'BALANCED'
}) {

    let finalMode = mode;

    if (opponentTeamId) {

        const [rows] = await db.query(`
        SELECT id, position
        FROM players
        WHERE team_id = ?
    `, [opponentTeamId]);

        finalMode = detectVsMode(rows);
    }
    const players =
        await buildPlayerProfiles({ teamId, playerIds, mode: finalMode });

    if (!players.length) {
        return {
            lineup_score: 0,
            lineup: []
        };
    }

    const sorted =
        [...players].sort((a, b) =>
            b.lineup_score - a.lineup_score
        );

    const lineup = [];

    const bestPG = sorted.find(p => p.position === 'PG');
    const bestC = sorted.find(p => p.position === 'C');

    if (bestPG) lineup.push(bestPG);

    if (bestC && !lineup.some(p => p.player_id === bestC.player_id)) {
        lineup.push(bestC);
    }

    for (const p of sorted) {

        if (lineup.length >= 5) break;
        if (lineup.some(x => x.player_id === p.player_id)) continue;

        lineup.push(p);
    }

    let score =
        lineup.reduce((sum, p) => sum + p.lineup_score, 0);

    score += calculateSynergyBonus(lineup);
    score -= calculateCompositionPenalty(lineup);
    score += calculateMatchupBonus(lineup, finalMode);

    return {
        lineup_score: Number(score.toFixed(2)),
        lineup,
        mode: finalMode
    };
}
function detectVsMode(opponentPlayers = []) {

    let interior = 0;
    let exterior = 0;

    for (const p of opponentPlayers) {

        const styles = p.styles || [];

        if (['C', 'PF'].includes(p.position)) interior += 2;
        if (['PG', 'SG'].includes(p.position)) exterior += 2;
        if (styles.includes('Rebounder') || styles.includes('Rim Protector')) {
            interior += 2;
        }

        if (styles.includes('Shooter') || styles.includes('Playmaker')) {
            exterior += 2;
        }

        if (styles.includes('Defensive Anchor')) {
            interior += 1;
        }

        if (styles.includes('Perimeter Defender')) {
            exterior += 1;
        }
    }

    if (interior > exterior * 1.2) return 'VS_INTERIOR';
    if (exterior > interior * 1.2) return 'VS_EXTERIOR';

    return 'BALANCED';
}

function calculateMatchupBonus(lineup, mode) {

    let bonus = 0;

    if (mode === 'VS_INTERIOR') {
        bonus += lineup.filter(p =>
            p.styles.includes('Shooter')
        ).length * 5;
    }

    if (mode === 'VS_EXTERIOR') {
        bonus += lineup.filter(p =>
            p.styles.includes('Defensive Anchor')
        ).length * 6;
    }

    return bonus;
}

module.exports = {
    calculateLineupEngine,
    buildPlayerProfiles
};