const router = require('express').Router();
const controller = require('../controllers/favorite.controller');
const verifyToken = require('../middleware/auth');

router.post('/favorites', verifyToken, controller.addFavorite);
router.get('/favorites', verifyToken, controller.getFavorites);
router.delete('/favorites/:playerId', verifyToken, controller.removeFavorite);

module.exports = router;