const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruitmentSchema = new Schema({
    jobname: { type: String, required: true},
    noofworkers: { type: String, required: true },
    requirements: {type: String,required: true},
    description: {type: String,required: true},
    limitedtime: {type: Boolean,required: true},
    date: {type: String,required: false},
    time:{type: Date,required:true}
}, { timestamps: true });

module.exports = mongoose.model('RecruitmentInfo', RecruitmentSchema);
