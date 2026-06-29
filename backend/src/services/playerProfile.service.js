const db = require('../config/db');
const impactService = require('./playerImpact.service');
const leagueService = require('./leagueAnalytics.service');
const NBAPlayerProfileBuilder = require('./templates/NBAPlayerProfileBuilder');

class PlayerProfileService {

    async getProfiles({ teamId, playerIds, mode }) {

        const league = await leagueService.getLeagueAnalytics();
        const impacts = await impactService.getPlayerImpactScores();

        const impactMap = new Map(
            impacts.map(p => [Number(p.player_id), p])
        );

        const builder = new NBAPlayerProfileBuilder(impactMap, league);

        let players = [];

        if (teamId) {
            const [rows] = await db.query(
                `SELECT id, name, position FROM players WHERE team_id = ?`,
                [teamId]
            );
            players = rows;
        }

        if (playerIds) {
            const [rows] = await db.query(
                `SELECT id, name, position FROM players WHERE id IN (?)`,
                [playerIds]
            );
            players = rows;
        }

        const profiles = [];

        for (const player of players) {
            const profile = await builder.build(player, {
                mode,
                league
            });

            profiles.push(profile);
        }

        return profiles;
    }
}

module.exports = PlayerProfileService;