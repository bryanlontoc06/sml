const Status = require('../model/Status');

const getAllStatus = async (req, res) => {
    //  Sample
    //  http://localhost:3500/status?page=1&limit=2
    if (req.query.page && req.query.limit) {
        const result = await Status.paginate({}, { page: req.query.page, limit: req.query.limit });
        res.status(200).json(result);
    } else {
        const status = await Status.find();
        if (!status) return res.status(204).json({ 'message': 'No status found' });
        res.status(200).json(status);
    }
}

const createNewStatus = async (req, res) => {
    if (!req?.body?.name) {
        return res.status(400).json({ 'message': 'Status name required' });
    }

    const duplicate = await Status.findOne({ name: req?.body?.name.toLowerCase() }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        const result = await Status.create({
            name: req.body.name
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateStatus = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const status = await Status.findOne({ _id: req.body.id }).exec();
    if (!status) {
        return res.status(204).json({ "message": `No status matches ID ${req.body.id}.` });
    }
    const duplicate = await Status.findOne({ name: req?.body?.name.toLowerCase() }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict
    if (req?.body?.name) status.name = req.body.name;
    const result = await status.save();
    res.status(200).json(result);
}

const deleteStatus = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Status ID required.' });

    const status = await Status.findOne({ _id: req.body.id }).exec();
    if (!status) {
        return res.status(204).json({ "message": `No status matches ID ${req.body.id}.` });
    }
    const result = await Status.deleteOne(); //{ _id: req.body.id }
    res.status(200).json(result);
}

const getStatus = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Status ID required.' });

    const status = await Status.findOne({ _id: req.params.id }).exec();
    if (!status) {
        return res.status(204).json({ "message": `No status matches ID ${req.params.id}.` });
    }
    res.status(200).json(status);
}

module.exports = {
    getAllStatus,
    createNewStatus,
    updateStatus,
    deleteStatus,
    getStatus
}