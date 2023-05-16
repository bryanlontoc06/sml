const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    patientNo: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    photo: {
        type: String
    },
    age: {
        type: Number
    },
    records: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest',
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);