const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

const labtestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    requirements: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number
    },
    prevPrice: {
        type: Number
    },
    discountPercentage: {
        type: Number
    }
}, { timestamps: true });

labtestSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('LabTest', labtestSchema);