function getPercentile(ranking, playerId) {

    const item = ranking.find(r => r.player_id == playerId);

    return item ? item.percentile : 0;
}

function generatePlayerStyles(playerAnalytics, leagueAnalytics) {

    const playerId = playerAnalytics.player_id;

    const p = playerAnalytics?.averages || {};
    const s = playerAnalytics?.shooting || {};
    
    const styles = [];

    const getPct = (metric) =>
        getPercentile(
            leagueAnalytics.metrics[metric].ranking,
            playerId
        );

    const pointsPct = getPct('points');
    const reboundsPct = getPct('rebounds');
    const assistsPct = getPct('assists');
    const stealsPct = getPct('steals');
    const blocksPct = getPct('blocks');
    const threePct = getPct('three_pct');

    if (
        pointsPct >= 0.70 ||
        p.points >= 24
    ) {
        styles.push('Scorer');
    }

    if (
        assistsPct >= 0.55 ||
        p.assists >= 8
    ) {
        styles.push('Playmaker');
    }

    if (
        threePct >= 0.55 ||
        s.three_pct >= 0.42
    ) {
        styles.push('Shooter');
    }

    if (
        reboundsPct >= 0.65 ||
        p.rebounds >= 9
    ) {
        styles.push('Rebounder');
    }

    if (
        blocksPct >= 0.70 ||
        (
            reboundsPct >= 0.70 &&
            blocksPct >= 0.50
        )
        ||
        p.blocks >= 2
    ) {
        styles.push('Defensive Anchor');
    }

    if (
        stealsPct >= 0.70 ||
        p.steals >= 2
    ) {
        styles.push('Perimeter Defender');
    }

    if (
        s.ts_pct >= 0.60
    ) {
        styles.push('Efficient Scorer');
    }

    if (
        p.points >= 15 &&
        p.assists >= 4 &&
        p.rebounds >= 5
    ) {
        styles.push('All-Around');
    }

    if (
        blocksPct >= 0.85 &&
        p.blocks >= 2
    ) {
        styles.push('Rim Protector');
    }

    if (
        assistsPct >= 0.80 &&
        p.assists >= 8
    ) {
        styles.push('Floor General');
    }

    if (
        ['C', 'PF'].includes(
            playerAnalytics.position
        ) &&
        s.three_pct >= 0.35 &&
        threePct >= 0.55
    ) {
        styles.push('Stretch Big');
    }

    if (
        styles.includes('Scorer') &&
        (
            styles.includes('Defensive Anchor') ||
            styles.includes('Perimeter Defender')
        )
    ) {
        styles.push('Two-Way Player');
    }

    return {
        player_id: playerId,
        styles
    };
}
module.exports = {
    generatePlayerStyles
};