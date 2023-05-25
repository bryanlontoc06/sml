const express = require('express');
const router = express.Router();
const statusController = require('../../controllers/statusController');
const profileMiddleware = require('../../middleware/profileMiddleware');

router.route('/')
    .get(statusController.getAllStatus)
    .post(profileMiddleware, statusController.createNewStatus)
    .put(statusController.updateStatus)
    .delete(statusController.deleteStatus);

router.route('/:id')
    .get(statusController.getStatus);


module.exports = router;