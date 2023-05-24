const Patient = require('../model/Patient');
const LabTest = require('../model/LabTest');
const uploadImage = require('../config/uploadImage');
const toTitleCase = require('../config/toTitleCase');
const moment = require('moment');

const getAllPatient = async(req, res) => {
    //  Sample
    //  http://localhost:3500/patient?page=1&limit=2
    const options = {
        lean:     true,
        populate : 'records'
    };

    if (req.query.page && req.query.limit) {
        const result = await Patient.paginate({}, options, { page: req.query.page, limit: req.query.limit });
        res.status(200).json(result);
    } else {
        const patient = await Patient.find().populate('records');
        if (!patient) return res.status(204).json({ 'message': 'No patient found' });
        res.status(200).json(patient);
    }
}

const createNewPatient = async (req, res) => {
    const {fname,
        lname,
        birthDate,
        address,
        phoneNumber,
        photo,
        rec,
        remarks
    } = req?.body;

    if (!fname && !lname) {
        return res.status(400).json({ 'message': 'First Name and Last Name are required' });
    }

    /* This code is checking if there is already an patient with the same first name and last name as
    the one being created or updated. If there is a duplicate, it sends a 409 status code indicating
    a conflict. */
    const duplicateName = await Patient.findOne({ firstname: toTitleCase(fname), lastname: toTitleCase(lname)}).exec();
    if (duplicateName) {
        return res.sendStatus(409); //Conflict
    }

    /* Counting the number of documents in the Patient collection and adding 1 to it.
    This is used to generate a unique patient ID for the new patient being created. */
    let patientCount = await Patient.countDocuments() + 1;

    // const statusID = await LabTest.findOne({ name: status }).exec();
    let cloudImg;

    /* This code is checking if there is an image file in the request body. If there is, it calls the
    `uploadImage` function to upload the image to a cloud storage service and assigns the resulting URL
    to the `cloudImg` variable. If there is no image file in the request body, it assigns an empty
    string to the `cloudImg` variable. */
    if (photo) {
        try {
            cloudImg = await uploadImage(photo);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    } else {
        cloudImg = '';
    }

    // Calculating Age
    const displayAge = (birth, target) => {
        let months = target.diff(birth, 'months', true)
        let birthSpan = {year: Math.floor(months/12), month: Math.floor(months)%12, day: Math.round((months%1)*target.daysInMonth(),0)}
        // you can adjust below logic as your requirements by yourself
        if (birthSpan.year < 1 && birthSpan.month < 1) {
          return birthSpan.day + ' day' + (birthSpan.day > 1 ? 's' : '')
        } else if (birthSpan.year < 1) {
          return birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : ' ') + birthSpan.day + ' day' + (birthSpan.day > 1 ? 's' : '')
        } else if (birthSpan.year < 2) {
          return birthSpan.year + ' year' + (birthSpan.year > 1 ? 's ' : ' ') + birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : '')
        } else {
          return birthSpan.year + ' year' + (birthSpan.year > 1 ? 's' : '')
        }
    }

    const day = moment(birthDate).format('DD')
    const month = moment(birthDate).format('MM')
    const year = moment(birthDate).format('YYYY')
    // moment([yyyy, mm, dd])
    let birth = moment([year, month, day])

    const currentAge = displayAge(birth, moment())

    try {
        const result = await Patient.create({
            patientNo: `${moment(birthDate).format("YYMMDD")}-${patientCount}`,
            firstname: toTitleCase(fname),
            lastname: toTitleCase(lname),
            address,
            birthDate,
            age: currentAge,
            phoneNumber,
            records: rec,
            remarks,
            photo: cloudImg
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updatePatient = async (req, res) => {
    const {fname,
        lname,
        birthDate,
        address,
        phoneNumber,
        photo,
        rec,
        remarks
    } = req?.body;

    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const patient = await Patient.findOne({ _id: req.body.id }).exec();

    if (!patient) {
        return res.status(204).json({ "message": `No patient matches ID ${req.body.id}.` });
    }

    /* Finding all the documents in the `Employee` collection except for the one with the `_id` value specified in the
    request body. It is used to check if there are any other employees with the same first name and
    last name as the one being updated, to avoid creating a duplicate. */
    const otherPatient = await Patient.find({ _id: {$ne: req.body.id}});

    /* Creating an array of boolean values indicating whether each employee in the `otherEmployees`
    array has the same first name and last name as the employee being updated.
    It does this by using the `map()` method to iterate over each employee in the
    `otherEmployees` array and returning `true` if the employee's `firstname` property matches the
    `fname` value passed in the request body and the employee's `lastname` property matches the
    `lname` value passed in the request body. The resulting array of boolean values is assigned to
    the `duplicateName` variable. */
    const duplicateName = otherPatient.map((pat) => {return (pat.firstname === toTitleCase(fname)) && (pat.lastname === toTitleCase(lname)) })

    let cloudImg;
    if (photo) {
        try {
            cloudImg = await uploadImage(photo);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    } else {
        cloudImg = '';
    }

    // Calculating Age
    const displayAge = (birth, target) => {
        let months = target.diff(birth, 'months', true)
        let birthSpan = {year: Math.floor(months/12), month: Math.floor(months)%12, day: Math.round((months%1)*target.daysInMonth(),0)}
        // you can adjust below logic as your requirements by yourself
        if (birthSpan.year < 1 && birthSpan.month < 1) {
          return birthSpan.day + ' day' + (birthSpan.day > 1 ? 's' : '')
        } else if (birthSpan.year < 1) {
          return birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : ' ') + birthSpan.day + ' day' + (birthSpan.day > 1 ? 's' : '')
        } else if (birthSpan.year < 2) {
          return birthSpan.year + ' year' + (birthSpan.year > 1 ? 's ' : ' ') + birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : '')
        } else {
          return birthSpan.year + ' year' + (birthSpan.year > 1 ? 's' : '')
        }
    }

    const day = moment(birthDate).format('DD')
    const month = moment(birthDate).format('MM')
    const year = moment(birthDate).format('YYYY')
    // moment([yyyy, mm, dd])
    let birth = moment([year, month, day])

    const currentAge = displayAge(birth, moment())

    if (fname ||
        lname ||
        birthDate ||
        address ||
        phoneNumber ||
        photo ||
        rec ||
        remarks) {
        patient.firstname = toTitleCase(fname);
        patient.lastname = toTitleCase(lname);
        patient.address = address;
        patient.birthDate = birthDate;
        patient.age = currentAge;
        patient.phoneNumber = phoneNumber;
        patient.photo = cloudImg;
        patient.rec = rec;
        patient.remarks = remarks;
    };
    if (!fname || !lname) {
        return res.status(400).json({ 'message': 'First Name and Last Name are required' });
    }

    if (!duplicateName.includes(true)) {
        const result = await patient.save();
        res.status(200).json(result);
    } else {
        return res.sendStatus(409); //Conflict
    }
}

const deletePatient = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Patient ID required.' });

    const patient = await Patient.findOne({ _id: req.body.id }).exec();

    if (!patient) {
        return res.status(204).json({ "message": `No patient matches ID ${req.body.id}.` });
    }
    const result = await Patient.deleteOne(); //{ _id: req.body.id }
    res.status(200).json(result);
}

const getPatient = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Patient ID required.' });

    const patient = await Patient.findOne({ _id: req.params.id }).populate('records');
    if (!patient) {
        return res.status(204).json({ "message": `No patient matches ID ${req.params.id}.` });
    }
    res.status(200).json(patient);
}

module.exports = {
    getAllPatient,
    createNewPatient,
    updatePatient,
    getPatient,
    deletePatient
}