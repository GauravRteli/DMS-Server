const express = require("express");
const router = express.Router();
const RecruitmentSchema = require("../model/Recruitment.js");
const AppUser = require("../model/AppUser.js");
const UserSchema = require("../model/UserSchema.js");

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
    salary,
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
    salary: salary,
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
      sex: sex,
      shift: shift,
      workerAge: workerAge,
      salary: salary,
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

router.post("/get-job", async (req, res) => {
  const { job_id } = req.body;
  const job = await RecruitmentSchema.findById(job_id);
  if (job) {
    res.status(200).send(job);
  } else {
    res.status(201).send({ message: "no job found !" });
  }
});

// recruit -- worker

router.post("/recruit-worker", async (req, res) => {
  const { job_id, workerId } = req.body;
  const job = await RecruitmentSchema.findById(job_id);
  const worker = await AppUser.findById(workerId);
  const admin = await UserSchema.find({});
  try {
    // removing the worker from workerregistered
    let workerregistered = job.workerregistered;
    let new_workerregistered = new Array();
    workerregistered.map((worker) => {
      if (worker._id != workerId) {
        new_workerregistered.push(worker);
      }
    });
    const new_job = await RecruitmentSchema.findByIdAndUpdate(
      job_id,
      {
        $set: { workerregistered: new_workerregistered },
      },
      {
        new: true,
      }
    ); // returns the new worker after updating the workerregistered

    // adding worker into the job
    let job_worker = new_job.recruitedWorkers;
    job_worker.push(worker);
    const new_job_after_update = await RecruitmentSchema.findByIdAndUpdate(
      job_id,
      {
        $set: { recruitedWorkers: job_worker },
      },
      {
        new: true,
      }
    );

    // adding worker to the  admin
    let admin_worker = admin[0].recruitedWorkers;
    admin_worker.push(worker);
    await UserSchema.findByIdAndUpdate(admin[0]._id, {
      $set: { recruitedWorkers: admin_worker },
    });

    // adding job  to the worker
    await AppUser.findByIdAndUpdate(workerId, {
      $set: { recruitedInJob: new_job_after_update },
    });

    res.status(200).send({new_jobData: new_job_after_update})

  } catch (e) {
    res.status(400).send({"message": "Error Occured"});
  }
});

// fake Requests ....... Cruicial .....  X X X X
router.post("/fake", async (req, res) => {
  const job = await RecruitmentSchema.updateMany(
    {},
    {
      $set: { workerregistered: new Array() },
    }
  );
  await AppUser.updateMany({}, {
    $set: { appliedjob: new Array() },
  });
  res.status(201).send({ message: "no job found !" });
});
router.post("/fake1", async(req,res) => {
  await AppUser.updateMany({},{
    $set: { recruitedInJob: null }
  })
  res.send("gaurav");
})

module.exports = router;
