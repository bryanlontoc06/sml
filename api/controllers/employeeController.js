const Employee = require('../model/Employee');
const Status = require('../model/Status');
const moment = require('moment');

const getAllEmployee = async(req, res) => {
    const employee = await Employee.find().populate('status');
    if (!employee) return res.status(204).json({ 'message': 'No employee found' });
    res.status(200).json(employee);
}

const createNewEmployee = async (req, res) => {
    const {firstname,
        lastname,
        jobTitle,
        dateHired,
        birthDate,
        phoneNumber,
        status,
        image} = req?.body

    if (!firstname && !lastname) {
        return res.status(400).json({ 'message': 'First Name and Last Name are required' });
    }

    const duplicateFirstname = await Employee.findOne({ firstname: req?.body?.firstname.toLowerCase() }).exec();
    const duplicateLastname = await Employee.findOne({ lastname: req?.body?.lastname.toLowerCase() }).exec();
    if (duplicateFirstname && duplicateLastname) return res.sendStatus(409); //Conflict

    let employeeCount = await Employee.countDocuments() + 1;
    const statusID = await Status.findOne({ name: status }).exec();

    try {
        const result = await Employee.create({
            employeeID: `${moment(birthDate).format("YYMMDD")}-${employeeCount}`,
            firstname,
            lastname,
            jobTitle,
            dateHired,
            birthDate,
            phoneNumber,
            status: statusID._id,
            image
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    const {firstname,
        lastname,
        jobTitle,
        dateHired,
        birthDate,
        phoneNumber,
        status,
        image} = req?.body;

    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }

    if (firstname || lastname) {
        const duplicateFirstname = await Employee.findOne({ firstname: firstname.toLowerCase() }).exec();
        const duplicateLastname = await Employee.findOne({ lastname: lastname.toLowerCase() }).exec();
        if (duplicateFirstname && duplicateLastname) return res.sendStatus(409); //Conflict
    }

    if (status) {
        const statusID = await Status.findOne({ name: status }).exec();
        employee.status = statusID._id;
    }

    if (firstname ||
        lastname ||
        jobTitle ||
        dateHired ||
        birthDate ||
        phoneNumber ||
        status ||
        image) {
        employee.firstname = firstname;
        employee.lastname = lastname;
        employee.jobTitle = jobTitle;
        employee.dateHired = dateHired;
        employee.birthDate = birthDate;
        employee.phoneNumber = phoneNumber;
        employee.image = image;
    };
    if (!firstname || !lastname) {
        return res.status(400).json({ 'message': 'First Name and Last Name are required' });
    }

    const result = await employee.save();
    res.status(200).json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });
    console.log(req?.body?.id)

    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await Employee.deleteOne(); //{ _id: req.body.id }
    res.status(200).json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.status(200).json(employee);
}

module.exports = {
    getAllEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}