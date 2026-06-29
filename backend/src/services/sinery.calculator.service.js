const { normalizeStyles } = require('../utils/normalizeStyles');

class SynergyCalculator {

    calculate(lineup) {

        const styles = lineup.flatMap(p =>
            normalizeStyles(p.styles)
        );

        let bonus = 0;

        if (styles.includes('Scorer') && styles.includes('Playmaker')) bonus += 12;
        if (styles.includes('Playmaker') && styles.includes('Shooter')) bonus += 20;
        if (styles.includes('Scorer') && styles.includes('Shooter')) bonus += 15;
        if (styles.includes('Defensive Anchor') && styles.includes('Rebounder')) bonus += 10;
        if (styles.includes('Rim Protector') && styles.includes('Rebounder')) bonus += 10;

        return bonus;
    }
}

module.exports = new SynergyCalculator();