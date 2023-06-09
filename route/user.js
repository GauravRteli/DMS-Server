const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const RecruitmentSchema = require("../model/Recruitment.js");
const AppUserSchema = require("../model/AppUser");

router.post("/appuserregistration", async (req, res) => {
  const { name, sex, email, phoneNo, dateOfBirth, skills, password } = req.body;
  const user1 = await AppUserSchema.findOne({ email: email });

  if (user1) {
    res.status(201).send({ message: "Email is already used" });
  } else {
    const NewPassword = await bcrypt.hash(password, 10);
    const user = new AppUserSchema({
      name,
      sex,
      email,
      phoneNo,
      dateOfBirth,
      skills,
      password: NewPassword,
    });

    const data = await user.save();
    res.status(200).send({ message: "User Saved", data: data });
  }
});

// POST: Login Route
router.post("/appuser-login", async (req, res) => {
  const { email, password } = req.body;
  const user = await AppUserSchema.findOne({ email: email });
  try{
    
    if (!user) {
      res.status(201).send({ message: "Invalid Inputs Username and Password" });
    } else if (user && !(await bcrypt.compare(password, user.password))) {
      res.status(201).send({ message: "Invalid Inputs Username and Password" });
    } else {
      res.status(200).send(user);
    }
  }catch(e){
    res.send(e);
  }
});

// post -Edit App User

router.post("/edit-appuser", async (req, res) => {
  const { workerId, name, sex, email, phoneNo, dateOfBirth, skills, bio } = req.body;

  const updated_user = await AppUserSchema.findByIdAndUpdate(workerId,{
    $set:{
      name: name,
      sex: sex,
      email: email,
      phoneNo: phoneNo,
      dateOfBirth: dateOfBirth,
      skills: skills,
      bio: bio
    }
  },{
    new: true
  });

  res.status(200).send(updated_user);

});

// getUser

router.post("/get-appuser", async (req, res) => {
  console.log(req.body);
  const user = await AppUserSchema.findById(req.body.userid);
  console.log(user);
  res.status(200).send(user);
});

// getJobs

router.get("/get-jobs", async (req, res) => {
  const jobs = await RecruitmentSchema.find({});
  res.status(200).send(jobs);
});

// registration in job
router.post("/user-jobapplication", async (req, res) => {
  const { user, job_id } = req.body;
  const job = await RecruitmentSchema.findById(job_id);
  let userapplications = job.workerregistered; // the user which have registered in the job

  const appliedUser = await AppUserSchema.findById(user._id);
  let jobapplications = appliedUser.appliedjob; // job in which the user has applied .....

  jobapplications.push({
    job: job,
    status: 0,
  });
  userapplications.push(user);

  await RecruitmentSchema.findByIdAndUpdate(job_id, {
    $set: { workerregistered: userapplications },
  });
  await AppUserSchema.findByIdAndUpdate(user._id, {
    $set: { appliedjob: jobapplications },
  });
  res
    .status(200)
    .send({
      message: `SuccessFully Applied in the job application for ${job.jobname}`,
    });
});

module.exports = router;
