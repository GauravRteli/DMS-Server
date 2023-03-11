const express = require("express");
const router = express.Router();
const RecruitmentSchema = require('../model/Recruitment.js');

router.post('/add-recruitment',async(req,res) => {
    const { jobName,noofworkers, requirements, description, limitedtime, date } = req.body;
    console.log(req.body);
    const recruit = new RecruitmentSchema({
        jobname: jobName,
        noofworkers: noofworkers,
        requirements: requirements,
        description: description,
        limitedtime: limitedtime,
        date: (limitedtime)?date:"",
        time: new Date()
    })
    const data = await recruit.save();

    if(data){
        res.status(200).json({data, message: recruit.time.getTime()});
    }else{
        res.status(400).json({message: "Some Error Occured !"});
    }
});
router.get('/get-recruitments',async(req,res) => {
    const data = await RecruitmentSchema.find({});
    res.json(data);
});

module.exports = router;