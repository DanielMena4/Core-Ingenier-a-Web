class PlayerProfileTemplate {

    async build(player, context) {

        const analytics = await this.getAnalytics(player);

        const impact = await this.getImpact(player);

        const styles = this.generateStyles(
            analytics,
            context.league
        );

        const multiplier =
            this.calculateMultiplier(
                styles.styles,
                context.mode
            );

        return this.createProfile(
            player,
            impact,
            styles,
            multiplier
        );
    }

    async getAnalytics() {
        throw new Error('getAnalytics not implemented');
    }

    async getImpact() {
        throw new Error('getImpact not implemented');
    }

    generateStyles() {
        throw new Error('generateStyles not implemented');
    }

    calculateMultiplier() {
        throw new Error('calculateMultiplier not implemented');
    }

    createProfile() {
        throw new Error('createProfile not implemented');
    }
}

module.exports = PlayerProfileTemplate;