const BaseMultiplierStrategy = require('./BaseMultiplierStrategy');

class VsInteriorStrategy extends BaseMultiplierStrategy {

    constructor() {

        super({

            'Defensive Anchor': 0.18,
            Rebounder: 0.15,
            'Rim Protector': 0.12,
            'Perimeter Defender': 0.05

        });

    }

}

module.exports = VsInteriorStrategy;