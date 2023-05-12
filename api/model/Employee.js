const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    employeeID: {
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
    jobTitle: {
        type: String
    },
    dateHired: {
        type: Date
    },
    birthDate: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Status',
            required: true
    },
    image: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);