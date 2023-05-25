const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

const promoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type:Number,
        required: true
    },
    requirements: [{
        type: String
    }],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    discountPrice: {
        type: Number
    },
    discountPercentage: {
        type: Number
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

promoSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Promo', promoSchema);