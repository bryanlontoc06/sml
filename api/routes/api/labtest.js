const express = require('express');
const router = express.Router();
const labtestController = require('../../controllers/labtestController');

router.route('/')
    .get(labtestController.getAllLabTest)
    .post(labtestController.createNewLabTest)
    .put(labtestController.updateLabTest)
    .delete(labtestController.deleteLabTest);

router.route('/:id')
    .get(labtestController.getLabTest)


module.exports = router;