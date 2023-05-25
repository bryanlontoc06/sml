const express = require('express');
const router = express.Router();
const promoController = require('../../controllers/promoController');
const profileMiddleware = require('../../middleware/profileMiddleware');

router.route('/')
    .get(promoController.getAllPromo)
    .post(profileMiddleware, promoController.createNewPromo)
    .put(promoController.updatePromo)
    .delete(promoController.deletePromo);

router.route('/:id')
    .get(promoController.getPromo);


module.exports = router;