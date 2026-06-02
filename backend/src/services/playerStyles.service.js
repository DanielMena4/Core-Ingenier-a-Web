function getPercentile(ranking, playerId) {

    const item = ranking.find(r => r.player_id == playerId);

    return item ? item.percentile : 0;
}

function generatePlayerStyles(playerAnalytics, leagueAnalytics) {

    const playerId = playerAnalytics.player_id;

    const p = playerAnalytics.averages;
    const s = playerAnalytics.shooting;

    const styles = [];

    const threePctRank = getPercentile(
        leagueAnalytics.metrics.three_pct.ranking,
        playerId
    );

    if (threePctRank >= 0.80 && s.three_pct >= 0.35) {
        styles.push("Shooter");
    }

    const assistRank = getPercentile(
        leagueAnalytics.metrics.assists.ranking,
        playerId
    );

    const turnoverRank = getPercentile(
        leagueAnalytics.metrics.turnovers.ranking,
        playerId
    );

    if (assistRank >= 0.75 && turnoverRank <= 0.4) {
        styles.push("Playmaker");
    }

    const pointsRank = getPercentile(
        leagueAnalytics.metrics.points.ranking,
        playerId
    );

    if (pointsRank >= 0.75) {
        styles.push("Scorer");
    }

    const stealRank = getPercentile(
        leagueAnalytics.metrics.steals.ranking,
        playerId
    );

    const blockRank = getPercentile(
        leagueAnalytics.metrics.blocks.ranking,
        playerId
    );

    if (stealRank >= 0.70 || blockRank >= 0.70) {
        styles.push("Defensive Anchor");
    }


    const reboundRank = getPercentile(
        leagueAnalytics.metrics.rebounds.ranking,
        playerId
    );

    if (reboundRank >= 0.70) {
        styles.push("Rebounder");
    }

    const assists = p.assists;
    const rebounds = p.rebounds;
    const points = p.points;

    if (points >= 15 && assists >= 4 && rebounds >= 5) {
        styles.push("All-Around");
    }

    return {
        player_id: playerId,
        styles
    };
}

module.exports = {
    generatePlayerStyles
};