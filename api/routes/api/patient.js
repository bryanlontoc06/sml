const express = require('express');
const router = express.Router();
const patientController = require('../../controllers/patientController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), patientController.getAllPatient)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), patientController.createNewPatient)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), patientController.updatePatient)
    .delete(verifyRoles(ROLES_LIST.Admin), patientController.deletePatient)

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), patientController.getPatient)


module.exports = router;