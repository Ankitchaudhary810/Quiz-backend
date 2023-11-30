const mrModel = require("../models/Mr");
const Quiz = require("../models/Quiz")

const createMr = async (req, res) => {
    try {
        const { USERNAME, MRID, PASSWORD, EMAIL, ROLE, HQ, REGION, BUSINESSUNIT, DOJ, SCCODE } = req.body;

        let mr;
        mr = await mrModel.findOne({ MRID: MRID });

        if (mr) return res.status(400).json({ msg: "MRID is already Exists" });

        mr = new mrModel({
            USERNAME,
            MRID,
            PASSWORD,
            EMAIL,
            ROLE,
            HQ,
            REGION,
            BUSINESSUNIT,
            DOJ,
            SCCODE,
        });

        mr.loginLogs.push({
            timestamp: new Date(),
            cnt: 1
        });
        await mr.save();


        return res.status(200).json(mr)

    } catch (error) {
        console.log("Error in CreateMr");
        let err = error.message
        return res.status(500).json({
            msg: "Internal Server Error",
            err
        });
    }

}


const loginMr = async (req, res) => {

    try {

        const { MRID, PASSWORD } = req.body;

        let mr = await mrModel.findOne({ MRID: MRID });

        if (!mr) return res.status(400).json({
            msg: "Mr Not Found"
        });

        mr.loginLogs.push({
            timestamp: new Date(),
            cnt: mr.loginLogs.length + 1
        });
        console.log(mr.loginLogs);
        await mr.save();

        const mrId = mr._id

        return res.status(200).json({
            success: true,
            mrId,
            MRID
        });
    } catch (error) {
        console.log("Error in Login");
        let err = error.message;
        return res.status(500).json({
            msg: "Internal Server Error",
            err
        })
    }
}


const GetDoctorsByMR = async (req, res) => {

    const mrId = req.params.id;


    try {
        // Find doctors with the specified mrReference
        const doctors = await Quiz.find({ mrReference: mrId });

        // Return the list of doctors
        return res.json({ doctors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createMr,
    loginMr,
    GetDoctorsByMR,
}