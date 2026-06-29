const PlayerProfileTemplate = require('./PlayerProfileTemplate');

const playerAnalyticsService = require('../playerAnalytics.service');
const styleEngine = require('../playerStyles.service');
const StrategyFactory = require('../strategies/StrategyFactory');

class NBAPlayerProfileBuilder extends PlayerProfileTemplate {

    constructor(impactMap, league) {

        super();

        this.impactMap = impactMap;
        this.league = league;
    }

    async getAnalytics(player) {
        return playerAnalyticsService.getPlayerAnalytics(player.id);
    }

    async getImpact(player) {
        return this.impactMap.get(player.id);
    }

    generateStyles(analytics, league) {

        return styleEngine.generatePlayerStyles(
            analytics,
            league
        );
    }

    calculateMultiplier(styles, mode) {

        const strategy = StrategyFactory.create(mode);

        return strategy.calculate(styles);
    }

    createProfile(player, impact, styles, multiplier) {

        const impactScore = Number(impact?.impact_score || 0);

        return {

            player_id: player.id,

            name: player.name,

            position: player.position,

            impact_score: impactScore,

            styles,

            multiplier,

            lineup_score: Number(
                (impactScore * multiplier).toFixed(2)
            )
        };
    }
}

module.exports = NBAPlayerProfileBuilder;