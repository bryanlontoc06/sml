const User = require('../model/User');

const getAllUsers = async (req, res, user) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.status(200).json(users);
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
    deleteUser,
    getUser
}