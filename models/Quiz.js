const mongoose = require("mongoose");



const doctorSchema = mongoose.Schema({

    doctorName: String,
    city: String,
    state: String,
    QuizCategory:{
        Entertainment: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        Astronomy: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        History: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        Science: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        Literature: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        Geography: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        Wildlife: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        Technology: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
        Mathematics: {
            isPlayed: Boolean,
            TotalPoints: Number
        },
    } 

})

const Quiz = mongoose.model('Quiz', doctorSchema)
module.exports = Quiz;