const BaseMultiplierStrategy = require('./BaseMultiplierStrategy');

class BalancedStrategy extends BaseMultiplierStrategy {

    constructor() {

        super({

            Scorer: 0.05,
            Shooter: 0.05,
            Playmaker: 0.05,
            'Defensive Anchor': 0.05,
            Rebounder: 0.05,
            'All-Around': 0.05

        });

    }

}

module.exports = BalancedStrategy;