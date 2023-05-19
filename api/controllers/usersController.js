const User = require('../model/User');
const ROLES_LIST = require('../config/roles_list');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res, user) => {
    //  Sample
    //  http://localhost:3500/users?page=1&limit=2
    if (req.query.page && req.query.limit) {
        const result = await User.paginate({}, { page: req.query.page, limit: req.query.limit });
        res.status(200).json(result);
    } else {
        const users = await User.find();
        if (!users) return res.status(204).json({ 'message': 'No users found' });
        res.status(200).json(users);
    }
}

const updateUser = async (req, res) => {
    // For managing own profile
    if ((req.id && req?.params?.id) && req.id === req?.params?.id) {
        const user = await User.findOne({ _id: req.id }).exec();

        // encrypt password
        const hashedPwd = await bcrypt.hash(req?.body?.newPassword, 10);
        const samePassword = await bcrypt.compare(req?.body?.oldPassword, user.password);

        // create and store the new user
        if (samePassword) {
            user.password = hashedPwd;
        } else {
            return res.status(400).json({ 'message': `Password did not match. Please try again.` })
        }

        const result = await user.save();
        res.status(200).json(result);
    } else {
        const user = await User.findOne({ _id: req.body.id }).exec();
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': 'User ID is required.' });
        }

        if (!user) {
            return res.status(400).json({ 'message': `No user matches ID ${req.body.id}.` });
        }

        const role = Object.keys(ROLES_LIST).includes(req?.body?.role);

        if (!(role)) {
            return res.status(400).json({ 'message': `No role on the list.` })
        }

        const setRole = () => {
            user.roles[req?.body?.role] = ROLES_LIST[req?.body?.role];
        }

        if (req?.body?.role !== 'User') {
            setRole();
        } else {
            user.roles = '';
            setRole();
        }
        const result = await user.save();
        res.status(200).json(result);
    }
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(200).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.status(200).json({ 'message': `User ${result.username} deleted successfully.` });
}

const getUser = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(200).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.status(200).json(user);
}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
}