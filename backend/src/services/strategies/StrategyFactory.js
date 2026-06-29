const BalancedStrategy = require('./BalancedStrategy');
const OffensiveStrategy = require('./OffensiveStrategy');
const DefensiveStrategy = require('./DefensiveStrategy');
const VsInteriorStrategy = require('./VsInteriorStrategy');
const VsExteriorStrategy = require('./VsExteriorStrategy');

class StrategyFactory {

    static create(mode) {

        switch (mode) {

            case 'OFFENSIVE':
                return new OffensiveStrategy();

            case 'DEFENSIVE':
                return new DefensiveStrategy();

            case 'VS_INTERIOR':
                return new VsInteriorStrategy();

            case 'VS_EXTERIOR':
                return new VsExteriorStrategy();

            default:
                return new BalancedStrategy();

        }

    }

}

module.exports = StrategyFactory;