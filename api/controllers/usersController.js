const User = require('../model/User');
const ROLES_LIST = require('../config/roles_list');

const getAllUsers = async (req, res, user) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.status(200).json(users);
}

const updateUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'User ID is required.' });
    }

    const user = await User.findOne({ _id: req.body.id }).exec();

    if (!user) {
        return res.status(400).json({ 'message': `No user matches ID ${req.body.id}.` });
    }

    const role = Object.keys(ROLES_LIST).includes(req?.body?.role);

    if (!(role)) {
        return res.status(400).json({ 'message': `No role on the list.` })
    }

    user.roles = '';
    user.roles[req?.body?.role] = ROLES_LIST[req?.body?.role];
    const result = await user.save();
    res.status(200).json(result);
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