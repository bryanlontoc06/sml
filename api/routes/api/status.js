const express = require('express');
const router = express.Router();
const statusController = require('../../controllers/statusController');

router.route('/')
    .get(statusController.getAllStatus)
    .post(statusController.createNewStatus)
    .put(statusController.updateStatus)
    .delete(statusController.deleteStatus);

router.route('/:id')
    .get(statusController.getStatus);


module.exports = router;