const BaseMultiplierStrategy = require('./BaseMultiplierStrategy');

class VsExteriorStrategy extends BaseMultiplierStrategy {

    constructor() {

        super({

            Shooter: 0.15,
            Playmaker: 0.12,
            'Perimeter Defender': 0.15,
            'Efficient Scorer': 0.08

        });

    }

}

module.exports = VsExteriorStrategy;