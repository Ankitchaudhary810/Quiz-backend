const mrModel = require("../models/Mr");
const Quiz = require("../models/Quiz");
const fs = require("fs");
const csv = require('csv-parser');
const xlsx = require('xlsx');

const handleSheetUpload = async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        for (const row of sheetData) {
            console.log({ row });
            const existingMr = await mrModel.findOne({ MRID: row.MRID });
            if (existingMr) {
                const newDoctor = await new Quiz({
                    doctorName: row.doctorName,
                    scCode: row.scCode,
                    city: row.city,
                    state: row.state,
                    mrReference: existingMr._id
                })
                await existingMr.save();
                await newDoctor.save();
            } else {
                const newMr = await mrModel.create({
                    USERNAME: row.USERNAME,
                    MRID: row.MRID,
                    PASSWORD: row.PASSWORD,
                    EMAIL: row.EMAIL,
                    ROLE: row.ROLE,
                    HQ: row.HQ,
                    REGION: row.REGION,
                    BUSINESSUNIT: row.BUSINESSUNIT,
                    DOJ: row.DOJ,
                    SCCODE: row.SCCODE,
                })
                await newMr.save();
                const newDoctor = await new Quiz({
                    doctorName: row.doctorName,
                    scCode: row.scCode,
                    city: row.city,
                    state: row.state,
                    mrReference: newMr._id
                })
                await newDoctor.save();
            }
        }
        res.status(200).json({ message: 'Data uploaded successfully' });
    } catch (error) {
        console.error(error);
        const err = error.message;
        res.status(500).json({ error: 'Internal server error', err });
    }
};



const createMr = async (req, res) => {
    try {
        const { USERNAME, MRID, PASSWORD, EMAIL, ROLE, HQ, REGION, BUSINESSUNIT, DOJ, SCCODE } = req.body;
        let mr;
        mr = await mrModel.findOne({ MRID: MRID });
        if (mr) return res.status(400).json({ msg: "MRID is already Exists!" });
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
    handleSheetUpload,
}