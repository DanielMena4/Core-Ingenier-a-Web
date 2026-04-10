const router = require('express').Router();
const controller = require('../controllers/team.controller');


router.get('/teams', controller.getTeams);
router.post('/teams', controller.createTeam);
router.put('/teams/:id', controller.updateTeam);
router.delete('/teams/:id', controller.deleteTeam);

module.exports = router;