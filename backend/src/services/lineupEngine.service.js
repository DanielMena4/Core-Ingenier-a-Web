const LineupBuilder = require('./lineupBuilder.service');
const PlayerProfileService = require('./playerProfile.service');
const StrategyFactory = require('./strategies/StrategyFactory');

class LineupEngine {

    constructor() {
        this.profileService = new PlayerProfileService();
        this.builder = new LineupBuilder();
    }

    async calculate({
        teamId,
        playerIds,
        mode,
        opponentTeamId
    }) {

        const players = await this.profileService.getProfiles({
            teamId,
            playerIds,
            mode
        });

        const strategy = StrategyFactory.create({
            mode,
            opponentTeamId
        });

        return this.builder.build({
            players,
            strategy
        });
    }
}

module.exports = new LineupEngine();