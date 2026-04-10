const router = require('express').Router();
const controller = require('../controllers/favorite.controller');
const verifyToken = require('../middleware/auth');

router.post('/favorites', controller.addFavorite);
router.get('/favorites', controller.getFavorites);
router.delete('/favorites/:playerId', controller.removeFavorite);

module.exports = router;