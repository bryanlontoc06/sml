const express = require('express');
const router = express.Router();
const patientController = require('../../controllers/patientController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(patientController.getAllPatient)
    .post(patientController.createNewPatient)
    .put(patientController.updatePatient)
    .delete(verifyRoles(ROLES_LIST.Admin), patientController.deletePatient)

router.route('/:id')
    .get(patientController.getPatient)


module.exports = router;