function normalizeStyles(player) {
    return Array.isArray(player.styles)
        ? player.styles
        : Array.isArray(player.styles?.styles)
            ? player.styles.styles
            : [];
}

class LineupBuilder {

    build({ players, strategy, matchupMode }) {

        const sorted = [...players]
            .sort((a, b) => b.lineup_score - a.lineup_score);

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

        let score = 0;

        for (const p of lineup) {
            const styles = normalizeStyles(p);
            const multiplier = strategy.calculate(styles);

            score += p.lineup_score * multiplier;
        }

        return {
            lineup_score: Number(score.toFixed(2)),
            lineup,
            mode: strategy.constructor.name
        };
    }
}

module.exports = LineupBuilder;