const Employee = require('../model/Employee');
const Status = require('../model/Status');
const uploadImage = require('../config/uploadImage');
const moment = require('moment');

const getAllEmployee = async(req, res) => {
    const employee = await Employee.find().populate('status');
    if (!employee) return res.status(204).json({ 'message': 'No employee found' });
    res.status(200).json(employee);
}

const createNewEmployee = async (req, res) => {
    const {fname,
        lname,
        jobTitle,
        dateHired,
        birthDate,
        phoneNumber,
        status,
        image} = req?.body

    if (!fname && !lname) {
        return res.status(400).json({ 'message': 'First Name and Last Name are required' });
    }

    /* This code is checking if there is already an employee with the same first name and last name as
    the one being created or updated. If there is a duplicate, it sends a 409 status code indicating
    a conflict. */
    const duplicateFirstname = await Employee.findOne({ firstname: fname }).exec();
    const duplicateLastname = await Employee.findOne({ lastname: lname }).exec();
    if (duplicateFirstname !== null &&
        duplicateLastname !== null &&
        (duplicateFirstname.firstname.toLowerCase() === fname.toLowerCase()) &&
        (duplicateLastname.lastname.toLowerCase() === lname.toLowerCase())) {
        return res.sendStatus(409); //Conflict
    }

    /* Counting the number of documents in the Employee collection and adding 1 to it.
    This is used to generate a unique employee ID for the new employee being created. */
    let employeeCount = await Employee.countDocuments() + 1;

    /* Finding a document in the `Status` collection that has a `name` field matching the `status` value
    passed in the request body. It then assigns the `_id` value of that document to the `statusID` variable.
    This is used to set the `status` field of the `Employee` document being created or updated. */
    const statusID = await Status.findOne({ name: status }).exec();
    let cloudImg;

    /* This code is checking if there is an image file in the request body. If there is, it calls the
    `uploadImage` function to upload the image to a cloud storage service and assigns the resulting URL
    to the `cloudImg` variable. If there is no image file in the request body, it assigns an empty
    string to the `cloudImg` variable. */
    if (image) {
        try {
            cloudImg = await uploadImage(image);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    } else {
        cloudImg = '';
    }

    try {
        const result = await Employee.create({
            employeeID: `${moment(birthDate).format("YYMMDD")}-${employeeCount}`,
            firstname: fname,
            lastname: lname,
            jobTitle,
            dateHired,
            birthDate,
            phoneNumber,
            status: statusID._id,
            image: cloudImg
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    const {fname,
        lname,
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

    /* Finding all the documents in the `Employee` collection except for the one with the `_id` value specified in the
    request body. It is used to check if there are any other employees with the same first name and
    last name as the one being updated, to avoid creating a duplicate. */
    const otherEmployees = await Employee.find({ _id: {$ne: req.body.id}});

    /* Creating an array of boolean values indicating whether each employee in the `otherEmployees`
    array has the same first name and last name as the employee being updated.
    It does this by using the `map()` method to iterate over each employee in the
    `otherEmployees` array and returning `true` if the employee's `firstname` property matches the
    `fname` value passed in the request body and the employee's `lastname` property matches the
    `lname` value passed in the request body. The resulting array of boolean values is assigned to
    the `duplicateName` variable. */
    const duplicateName = otherEmployees.map((emp) => {return (emp.firstname === fname) && (emp.lastname === lname) })

    if (status) {
        const statusID = await Status.findOne({ name: status }).exec();
        employee.status = statusID._id;
    }
    let cloudImg;
    if (image) {
        try {
            cloudImg = await uploadImage(image);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    } else {
        cloudImg = '';
    }

    if (fname ||
        lname ||
        jobTitle ||
        dateHired ||
        birthDate ||
        phoneNumber ||
        status ||
        image) {
        employee.firstname = fname;
        employee.lastname = lname;
        employee.jobTitle = jobTitle;
        employee.dateHired = dateHired;
        employee.birthDate = birthDate;
        employee.phoneNumber = phoneNumber;
        employee.image = cloudImg;
    };
    if (!fname || !lname) {
        return res.status(400).json({ 'message': 'First Name and Last Name are required' });
    }

    if (!duplicateName.includes(true)) {
        const result = await employee.save();
        res.status(200).json(result);
    } else {
        return res.sendStatus(409); //Conflict
    }
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

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