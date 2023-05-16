const LabTest = require('../model/LabTest');
const toTitleCase = require('../config/toTitleCase');

const getAllLabTest = async(req, res) => {
    //  Sample
    //  http://localhost:3500/lab-test?page=1&limit=2
    if (req.query.page && req.query.limit) {
        const result = await LabTest.paginate({}, { page: req.query.page, limit: req.query.limit });
        res.status(200).json(result);
    } else {
        const labtest = await LabTest.find();
        if (!labtest) return res.status(204).json({ 'message': 'No laboratory test found' });
        res.status(200).json(labtest);
    }
}

const createNewLabTest = async (req, res) => {
    if (!req?.body?.name) {
        return res.status(400).json({ 'message': 'Laboratory Test name required' });
    }

    const duplicate = await LabTest.findOne({ name: toTitleCase(req?.body?.name) }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        const result = await LabTest.create({
            name: toTitleCase(req.body.name),
            description: req.body.description,
            price: req.body.price,
            discountedPrice: req.body.discountedPrice,
            prevPrice: req.body.prevPrice
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateLabTest = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const labtest = await LabTest.findOne({ _id: req.body.id }).exec();
    if (!labtest) {
        return res.status(204).json({ "message": `No laboratory test matches ID ${req.body.id}.` });
    }
    const otherLabTest = await LabTest.find({ _id: {$ne: req.body.id}});
    const duplicate = otherLabTest.map((status) => {return status.name === toTitleCase(req?.body?.name)})
    if (req?.body?.name ||
        req?.body?.description ||
        req?.body?.price ||
        req?.body?.discountedPrice ||
        req?.body?.prevPrice){
        labtest.name = toTitleCase(req.body.name)
        labtest.description = req.body.description
        labtest.price = req.body.price
        labtest.discountedPrice = req.body.discountedPrice
        labtest.prevPrice = req.body.prevPrice
    };
    if (!duplicate.includes(true)) {
        const result = await labtest.save();
        res.status(200).json(result);
    } else {
        return res.sendStatus(409); //Conflict
    }
}

const deleteLabTest = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Laboratory Test ID required.' });

    const labtest = await LabTest.findOne({ _id: req.body.id }).exec();
    if (!labtest) {
        return res.status(204).json({ "message": `No laboratory test matches ID ${req.body.id}.` });
    }
    const result = await LabTest.deleteOne(); //{ _id: req.body.id }
    res.status(200).json(result);
}

const getLabTest = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Laboratory Test ID required.' });

    const labtest = await LabTest.findOne({ _id: req.params.id }).exec();
    if (!labtest) {
        return res.status(204).json({ "message": `No laboratory test matches ID ${req.params.id}.` });
    }
    res.status(200).json(labtest);
}

module.exports = {
    getAllLabTest,
    createNewLabTest,
    updateLabTest,
    deleteLabTest,
    getLabTest
}