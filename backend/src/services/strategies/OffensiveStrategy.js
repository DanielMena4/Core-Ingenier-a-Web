const BaseMultiplierStrategy = require('./BaseMultiplierStrategy');

class OffensiveStrategy extends BaseMultiplierStrategy {

    constructor() {

        super({

            Scorer: 0.10,
            Shooter: 0.10,
            Playmaker: 0.08,
            'Efficient Scorer': 0.05

        });

    }

}

module.exports = OffensiveStrategy;