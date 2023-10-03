const express = require('express');
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");



// Middleware (INBUILT);
app.use(cors());
app.use(express.json());
dotenv.config();


// Mongodb Connection
mongoose.connect(process.env.URI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('connected', () => {
  console.log("Mongoose connection done");
})
db.on("error", (err)=> {
  console.log("Mongoose default connection fail: " + err);
})


app.get('/', (req,res)=> {
    return res.send("<p>QUIZ's Backend</p>")
})

const QuizRoutes = require("./routes/Quiz")
app.use('/api', QuizRoutes);


const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log("Server is running At" , port);
})