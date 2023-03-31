const express = require("express");
const router = express.Router();
const RecruitmentSchema = require("../model/Recruitment.js");
const AppUser = require("../model/AppUser.js")

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
    salary
  } = req.body;
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
    salary: salary
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
    salary,
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
      workerAge:workerAge,
      salary: salary
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

// get the particular job using the job_id

router.post("/get-job",async(req,res) => {
  const { job_id } = req.body;
  const job = await RecruitmentSchema.findById(job_id);
  if(job){
    res.status(200).send(job);
  }else{
    res.status(201).send({message: "no job found !"});
  }
})


// fake Requests ....... Cruicial .....  X X X X
router.post("/fake",async(req,res) => {
  const job = await RecruitmentSchema.findByIdAndUpdate("6425f3c6752c6e8bd2ea1b59",{
    $set:{workerregistered: new Array()}
  });
  await AppUser.findByIdAndUpdate("6425f5b24d1f4dd3ade0069a",{
    $set:{ appliedjob: new Array() }
  })
  await AppUser.findByIdAndUpdate("642748497e793717663ad0b5",{
    $set:{ appliedjob: new Array() }
  })
    res.status(201).send({message: "no job found !"});
})


module.exports = router;
