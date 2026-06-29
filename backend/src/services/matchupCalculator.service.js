const { normalizeStyles } = require('../utils/normalizeStyles');

class MatchupCalculator {

    bonus(lineup, mode) {

        let bonus = 0;

        if (mode === 'VS_INTERIOR') {
            bonus += lineup.filter(p =>
                normalizeStyles(p.styles).includes('Shooter')
            ).length * 5;
        }

        if (mode === 'VS_EXTERIOR') {
            bonus += lineup.filter(p =>
                normalizeStyles(p.styles).includes('Defensive Anchor')
            ).length * 6;
        }

        return bonus;
    }
}

module.exports = new MatchupCalculator();