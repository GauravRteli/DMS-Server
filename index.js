const express = require('express');
const cors = require('cors');
const app = express();
require('./db/db');
const PORT = 5000 ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(require('./route/auth'));
app.use(require('./route/recruitment'));

app.listen(PORT, () => {
    console.log(`Listening at the Port : ${PORT}`)
})