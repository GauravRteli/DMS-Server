require('dotenv').config()
const mongoose = require("mongoose");
// mongoose connection '
const url = process.env.REACT_APP_DATABASE_URL;
const connectionparams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(url,connectionparams).then(() => {
    console.log("Database created!");
}).catch((err) => {
    console.log("Not connected to data");
});