const BaseMultiplierStrategy = require('./BaseMultiplierStrategy');

class DefensiveStrategy extends BaseMultiplierStrategy {

    constructor() {

        super({

            'Defensive Anchor': 0.12,
            Rebounder: 0.10,
            'Rim Protector': 0.10,
            'Perimeter Defender': 0.08

        });

    }

}

module.exports = DefensiveStrategy;