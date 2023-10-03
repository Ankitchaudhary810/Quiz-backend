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
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const conn = mongoose.connection;

conn.once('open', () => {
  console.log("Mongoose connection is done");
})


app.get('/', (req,res)=> {
    return res.send("<p>QUIZ's Backend</p>")
})

const QuizRoutes = require("./routes/Quiz");
const { log } = require('console');
app.use('/api', QuizRoutes);


const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log("Server is running At" , port);
})