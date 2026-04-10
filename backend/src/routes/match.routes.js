const express = require('express');
const router = express.Router();
const controller = require('../controllers/match.controller');
const verifyToken = require('../middleware/auth');

router.get('/matches', verifyToken, controller.getMatches);
router.post('/matches', verifyToken, controller.createMatch);
router.delete('/matches/:id', verifyToken, controller.deleteMatch);
router.put('/matches/:id', verifyToken, controller.updateMatch);

module.exports = router;