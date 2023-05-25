const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

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
        type: String
    },
    records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest',
    }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

patientSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Patient', patientSchema);