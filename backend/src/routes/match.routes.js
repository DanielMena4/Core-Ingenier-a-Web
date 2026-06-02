const express = require('express');
const router = express.Router();

const controller = require('../controllers/match.controller');

router.get('/', controller.getMatches);

router.get('/:id', controller.getMatchById);

router.post('/', controller.createMatch);

router.put('/:id', controller.updateMatch);

router.delete('/:id', controller.deleteMatch);

module.exports = router;