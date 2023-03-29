const express = require("express");
const router = express.Router();
const RecruitmentSchema = require("../model/Recruitment.js");

router.post("/add-recruitment", async (req, res) => {
  const {
    jobName,
    noofworkers,
    requirements,
    description,
    limitedtime,
    date,
    workerAge,
    shift,
    sex,
  } = req.body;
  console.log(req.body);
  const recruit = new RecruitmentSchema({
    jobname: jobName,
    noofworkers: noofworkers,
    requirements: requirements,
    description: description,
    limitedtime: limitedtime,
    workerAge: workerAge,
    shift: shift,
    sex: sex,
    date: limitedtime ? date : "",
    time: new Date(),
  });
  const data = await recruit.save();

  if (data) {
    res.status(200).json({ data, message: recruit.time.getTime() });
  } else {
    res.status(400).json({ message: "Some Error Occured !" });
  }
});
router.get("/get-recruitments", async (req, res) => {
  const data = await RecruitmentSchema.find({});
  res.json(data);
});

router.post("/update-recruitment", async (req, res) => {
  const {
    jobname,
    date,
    description,
    limitedtime,
    noofworkers,
    requirements,
    id,
    sex,
    shift,
    workerAge,
  } = req.body;
  const recruitment = await RecruitmentSchema.findByIdAndUpdate(id, {
    $set: {
      jobname: jobname,
      date: date,
      description: description,
      limitedtime: limitedtime,
      noofworkers: noofworkers,
      requirements: requirements,
      sex:sex,
      shift:shift,
      workerAge:workerAge
    },
  });
  res.send(recruitment);
});

router.post("/delete-recruitment", async (req, res) => {
  const { id } = req.body;
  const deleted = await RecruitmentSchema.findByIdAndDelete(id);
  if (deleted)
    res.status(200).send({
      message: `Deleted the Recruitment With Jobname => ${deleted.jobname}`,
    });
  else {
    res.status(401).send({ message: "Error Occured !" });
  }
});

module.exports = router;
