const mongoose = require("mongoose");



const doctorSchema = mongoose.Schema({

    doctorName: String,
    city: String,
    state: String,
    mrReference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mr"
    },
    QuizCategory: {
        Entertainment: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
        Astronomy: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
        History: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
        },
        Science: {
            isPlayed: {
                type: Boolean,
                default: false
            },
            TotalPoints: {
                type: Number,
                default: 0
            }
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

const Quiz = mongoose.model('Quiz', doctorSchema);
module.exports = Quiz;