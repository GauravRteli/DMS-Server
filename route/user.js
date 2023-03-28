const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const AppUserSchema = require('../model/AppUser');
router.post('/appuserregistration',async (req,res) => {

    const {name,email,phoneNo,dateOfBirth,skills,password} = req.body;
    const user1 = await AppUserSchema.findOne({email: email});

    if(user1){
        res.status(201).send({message: "Email is already used"})
    }else{
        const NewPassword = await bcrypt.hash(password, 10);
        const user = new AppUserSchema({
            name,
            email,
            phoneNo,
            dateOfBirth,
            skills,
            password: NewPassword,
        });
    
        const data = await user.save();
        res.status(200).send({message: "User Saved",data: data})
    }


});

module.exports = router;