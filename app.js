//require("dotenv").config();
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require("./routes/auth.js");

const mongoose = require("mongoose");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("DB IS CONNECTED");
});

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:true})); 

app.use(cookieParser());
app.use(cors());

//routes
app.use("/api",authRoutes);

//port
const port = process.env.PORT || 8000;

//starting a server
app.listen(port, ()=>{
    console.log(`app is running at ${port}`);
});