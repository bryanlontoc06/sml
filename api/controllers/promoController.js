const Promo = require('../model/Promo');
const toTitleCase = require('../config/toTitleCase');

const getAllPromo = async (req, res) => {
    //  Sample
    //  http://localhost:3500/promo?page=1&limit=2
    if (req.query.page && req.query.limit) {
        const result = await Promo.paginate({}, { page: req.query.page, limit: req.query.limit });
        res.status(200).json(result);
    } else {
        const promo = await Promo.find();
        if (!promo) return res.status(204).json({ 'message': 'No promo found' });
        res.status(200).json(promo);
    }
}

const createNewPromo = async (req, res) => {
    if (!req?.body?.name) {
        return res.status(400).json({ 'message': 'Promo name required' });
    }

    const duplicate = await Promo.findOne({ name: toTitleCase(req?.body?.name) }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    if (req.body.startDate > req.body.endDate) return res.status(400).json({ "message": "Start Date cannot be ahead on the End Date. Please select proper date." })


    try {
        const result = await Promo.create({
            name: toTitleCase(req.body.name),
            description: req.body.description,
            price: req.body.price,
            requirements: req.body.requirements,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            discountedPrice: req.body.discountedPrice,
            discountPercentage: req.body.discountPercentage
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updatePromo = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const promo = await Promo.findOne({ _id: req.body.id }).exec();
    if (!promo) {
        return res.status(204).json({ "message": `No promo matches ID ${req.body.id}.` });
    }
    const otherPromo = await Promo.find({ _id: {$ne: req.body.id}});
    const duplicate = otherPromo.map((promo) => {return promo.name === toTitleCase(req?.body?.name)})
    if (req?.body?.name ||
        req?.body?.description ||
        req?.body?.price ||
        req?.body?.requirements ||
        req?.body?.startDate,
        req?.body?.endDate,
        req?.body?.discountedPrice ||
        req?.body?.discountPercentage){
        promo.name = toTitleCase(req.body.name)
        promo.description = req.body.description
        promo.price = req.body.price
        promo.requirements = req.body.requirements
        promo.startDate = req.body.startDate
        promo.endDate = req.body.endDate
        promo.discountedPrice = req.body.discountedPrice
        promo.discountPercentage = req.body.discountPercentage
    };
    if (!duplicate.includes(true)) {
        const result = await promo.save();
        res.status(200).json(result);
    } else {
        return res.sendStatus(409); //Conflict
    }
}

const deletePromo = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Promo ID required.' });

    const promo = await Promo.findOne({ _id: req.body.id }).exec();
    if (!promo) {
        return res.status(204).json({ "message": `No promo matches ID ${req.body.id}.` });
    }
    const result = await Promo.deleteOne(); //{ _id: req.body.id }
    res.status(200).json(result);
}


const getPromo = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Promo ID required.' });

    const promo = await Promo.findOne({ _id: req.params.id }).exec();
    if (!promo) {
        return res.status(204).json({ "message": `No promo matches ID ${req.params.id}.` });
    }
    res.status(200).json(promo);
}

module.exports = {
    getAllPromo,
    createNewPromo,
    updatePromo,
    deletePromo,
    getPromo
}