const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

const statusSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

statusSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Status', statusSchema);