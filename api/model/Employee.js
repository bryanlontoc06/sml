const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

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
    age: {
        type: String
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
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

employeeSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Employee', employeeSchema);