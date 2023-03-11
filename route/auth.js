const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserSchema = require('../model/UserSchema');
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;
// create a bot object ..
const bot = new TelegramBot(TOKEN, {polling: true});


// signing up the for the admin
router.post('/signup',async (req,res) => {

    console.log(req.body);
    const {username, password, email} = req.body;
    const NewPassword = await bcrypt.hash(password, 10);
    const user = new UserSchema({
        username,
        password: NewPassword,
        email
    });

    const data = await user.save();
    console.log(password);
    res.status(200).send({message: "User Saved",data: data})

});

// POST: Login Route
router.post("/login-user",async (req,res) => {
    const { username,password } = req.body;
    const user = await UserSchema.findOne({username : username});
    if(!user){
        res.status(201).send({message: "Invalid Inputs Username and Password"});
    }else if(user && !(await bcrypt.compare(password,user.password))){
        res.status(201).send({message: "Invalid Inputs Username and Password"});
    }else{
        res.status(200).send({message: "Valid User"});
    }
})

// OTP Generation and Sending it to the Client side
router.get("/getotp",async (req,res) => {
    const OTP = Math.floor((Math.random()*1000000)+1);
    bot.sendMessage(CHAT_ID,OTP);
    res.status(200).send({message: "Done !",OTP: OTP});
});



module.exports = router;