const router = require('express').Router();
const controller = require('../controllers/team.controller');
const verifyToken = require('../middleware/auth');

router.get('/teams', verifyToken, controller.getTeams);
router.post('/teams', verifyToken, controller.createTeam);
router.put('/teams/:id',verifyToken , controller.updateTeam);
router.delete('/teams/:id',verifyToken, controller.deleteTeam);

module.exports = router;