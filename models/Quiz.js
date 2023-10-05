const mongoose = require("mongoose");



const doctorSchema = mongoose.Schema({

    doctorName: String,
    city: String,
    state: String,
    QuizCategory:{
        Entertainment: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        Astronomy: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        History: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        Science: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        Literature: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        Geography: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        Wildlife: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        Technology: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
        Mathematics: {
            isPlayed:{
                type: Boolean,
                default:false
            },
            TotalPoints: Number
        },
    } 

})

const Quiz = mongoose.model('Quiz', doctorSchema)
module.exports = Quiz;