const router = require('express').Router();
const controller = require('../controllers/team.controller');


router.get('/', controller.getTeams);
router.post('/', controller.createTeam);
router.put('/:id', controller.updateTeam);
router.delete('/:id', controller.deleteTeam);

module.exports = router;