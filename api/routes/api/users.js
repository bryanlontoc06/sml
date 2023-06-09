const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const profileMiddleware = require('../../middleware/profileMiddleware');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), usersController.getAllUsers)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), usersController.getUser)
    .put(profileMiddleware, usersController.updateUser);

module.exports = router;