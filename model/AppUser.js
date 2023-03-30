const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppUserSchema = new Schema({
    name: {type: String,required: true},
    email: {type: String,required: true},
    phoneNo: {type: String,required: true},
    dateOfBirth: {type: String,required: true},
    skills:{type: Array,required: true},
    appliedjob:{type: Array,required: false,default: new Array()},
    password: {type: String,required: true},
},{ timestamps: true })

module.exports = mongoose.model('AppUserInfo',AppUserSchema);