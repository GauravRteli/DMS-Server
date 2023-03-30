const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecruitmentSchema = new Schema(
  {
    jobname: { type: String, required: true },
    noofworkers: { type: Number, required: true },
    workerAge: { type: Number, required: true },
    shift: { type: String, required: true },
    sex: { type: String, required: true },
    requirements: { type: String, required: true },
    salary:{type: Number,required: true},
    description: { type: String, required: true },
    limitedtime: { type: Boolean, required: true },
    date: { type: String, required: false },
    workerregistered:{type: Array, required: false, default: new Array() },
    time: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecruitmentInfo", RecruitmentSchema);
