class BaseMultiplierStrategy {

    constructor(rules) {
        this.rules = rules;
    }

    normalize(styles) {

        if (!styles) return [];

        if (Array.isArray(styles)) return styles;

        if (typeof styles === 'string') {
            try {
                const parsed = JSON.parse(styles);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                return styles.split(',').map(s => s.trim());
            }
        }

        return [];
    }

    calculate(styles = []) {

        const safeStyles = this.normalize(styles);

        let multiplier = 1;

        for (const style of safeStyles) {
            if (this.rules[style]) {
                multiplier += this.rules[style];
            }
        }

        return multiplier;
    }
}

module.exports = BaseMultiplierStrategy;