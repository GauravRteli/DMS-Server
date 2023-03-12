const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    admins: {type: Array, required: true}
});

module.exports = mongoose.model('AdminInfo',AdminSchema);