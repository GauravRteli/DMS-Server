const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserSchema = require('../model/UserSchema');
const AdminSchema = require('../model/AdminSchema');
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TOKEN;

// create a bot object ..
const bot = new TelegramBot(TOKEN, {polling: true});

// When new user enter we are storing the chat_id of that user in to the DataBase.
bot.onText(/\/start/,async (msg) => {
    const admins = await AdminSchema.find({});
    if(admins.length == 0){ // is no admins present .....
        const newadmindata = new AdminSchema({
            admins: new Array()
        });
        const data = await newadmindata.save();
        console.log(data);
    }
    let flag = false;
    admins.map(({admins}) => { // checking whether the user is already present or Not .....
        admins.map((element) => {
            if(element === msg.from.id){
                flag = true;
            }
        })
    })
    if(!flag){
        const admindata = await AdminSchema.find({});
        admindata[0].admins.push(msg.from.id);
        bot.sendMessage(msg.from.id,"New User");
        await admindata[0].save();
    }else{
        bot.sendMessage(msg.from.id,"Old User");
    }

})

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
    const admins = await AdminSchema.find({});
    admins[0].admins.map((element) => {
        bot.sendMessage(element,OTP);
    })
    res.status(200).send({message: "Done !",OTP: OTP});
});



module.exports = router;