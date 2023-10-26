const mongoose = require("mongoose");



const doctorSchema = mongoose.Schema({

    doctorName: String,
    city: String,
    state: String,
    QuizCategory: {
        Entertainment: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: Number
        },
        Astronomy: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: Number
        },
        History: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: Number
        },
        Science: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: Number
        },
        Literature: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
        Geography: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
        Wildlife: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
        Technology: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
        Mathematics: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
    }

})

const Quiz = mongoose.model('Quiz', doctorSchema)
module.exports = Quiz;