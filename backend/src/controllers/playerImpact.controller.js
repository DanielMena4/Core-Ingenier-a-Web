const service = require('../services/playerImpact.service');

const getPlayerImpact = async (req, res) => {
    try {
        const data = await service.getPlayerImpactScores();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error calculando impact score' });
    }
};

module.exports = {
    getPlayerImpact
};