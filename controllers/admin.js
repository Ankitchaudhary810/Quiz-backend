
const AdminModel = require("../models/admin");
const MrModel = require("../models/Mr");
const doctorModel = require("../models/Quiz");
const mongoose = require("mongoose")
const handleAdminCreation = async (req, res) => {
    try {
        const { Name, AdminId, Password, Gender, MobileNumber } = req.body;
        const admin = await AdminModel.findOne({ AdminId: AdminId });

        if (admin) {
            return res.status(400).json({
                msg: "AdminId Already Exitsts",
                success: false,
            })
        }

        const newAdmin = await new AdminModel({
            Name,
            AdminId,
            Password,
            Gender,
            MobileNumber,
        })

        await newAdmin.save();

        return res.status(200).json({
            success: true,
            newAdmin
        });
    }
    catch (error) {
        console.log('Error in handleTopMrByDoctor');
        let err = error.message;
        return res.status(500).json({
            msg: 'Internal Server Error',
            err,
        });
    }
};


const handleAdminLogin = async (req, res) => {
    try {
        const { AdminId, Password } = req.body;
        console.log(req.body);
        const admin = await AdminModel.findOne({ AdminId });
        console.log({ admin })
        if (admin) {
            if (admin.Password === Password) {
                return res.status(200).json({
                    msg: "Login",
                    success: true,
                    admin
                })
            } else {
                return res.status(400).json({
                    msg: "Password is Incorrect",
                    success: false,
                })
            }
        } else {
            return res.status(400).json({
                msg: "Admin Not Found",
                success: false
            })
        }
    } catch (error) {
        const errMsg = error.message;
        console.log({ errMsg });
        return res.status(500).json({
            msg: "Internal Server Error",
            errMsg
        })
    }
}


const handleAdminGet = async (req, res) => {

    try {
        const id = req.params.id;
        const admin = await AdminModel.findById({ _id: id })
        if (!admin) {
            return res.status(400).json({
                msg: "Admin Not Found"
            })
        }
        return res.json(admin);
    }
    catch (error) {
        const errMsg = error.message;
        console.log({ errMsg });
        return res.status(500).json({
            msg: "Internal Server Error",
            errMsg
        })
    }
}

const handleUpdateAdmin = async (req, res) => {

    try {
        const id = req.params.id;
        const { Name, AdminId, Password, Gender, MobileNumber } = req.body;

        const admin = await AdminModel.findById({ _id: id });
        if (!admin) {
            return res.status(400).json({ msg: "Admin Not Found" });
        }
        const UpdatedOptions = {
            Name,
            MobileNumber,
            Gender,
            Password
        }
        const udpatedAdmin = await AdminModel.findByIdAndUpdate(id, UpdatedOptions, { new: true })
        console.log({ udpatedAdmin });
        return res.status(200).json({
            msg: "Admin Updated",
            success: true,
        });
    } catch (error) {
        const errMsg = error.message;
        console.log({ errMsg });
        return res.status(500).json({
            msg: "Internal Server Error",
            errMsg
        })
    }
}

const handleMrData = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await AdminModel.findById(id).populate('Mrs', 'MRID _id USERNAME');

        if (!admin) {
            return res.status(400).json({ msg: "Admin not found" });
        }

        const mrData = admin.Mrs.map(mr => {
            return {
                MRID: mr.MRID,
                mrName: mr.USERNAME,
                _id: mr._id,
            };
        });

        console.log(mrData);

        return res.status(200).json(mrData);
    } catch (error) {
        const errMsg = error.message;
        console.log({ errMsg });
        return res.status(500).json({
            msg: "Internal Server Error",
            errMsg
        });
    }
};

const handleDoctorDataUnderAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ error: 'Invalid admin ID format' });
        }

        const adminData = await AdminModel.findById(adminId).populate({
            path: 'Mrs',
            model: 'Mr',
            options: { strictPopulate: false }
        });

        if (!adminData || !adminData.Mrs || adminData.Mrs.length === 0) {
            return res.status(404).json({ error: 'Admin not found or has no related MR data' });
        }

        const mrIdsArray = adminData.Mrs.map(mr => mr._id);

        const doctorsArray = await doctorModel.find({ mrReference: { $in: mrIdsArray } })
            .populate('mrReference', 'MRID HQ REGION BUSINESSUNIT DOJ USERNAME _id EMAIL')
            .populate({ path: 'quizCategories', model: 'QuizCategory' }) // Use the model name for quizCategories
            .exec();

        // Map the result to include quizCategories
        const formattedDoctorsArray = doctorsArray.map(doctor => ({
            _id: doctor._id,
            doctorName: doctor.doctorName,
            scCode: doctor.scCode,
            city: doctor.city,
            state: doctor.state,
            locality: doctor.locality,
            speciality: doctor.speciality,
            quizCategories: doctor.quizCategories,
            mrReference: {
                mrid: doctor.mrReference._id,
                mrName: doctor.mrReference.USERNAME,
                MRID: doctor.mrReference.MRID,
                mrEmail: doctor.mrReference.EMAIL,
                HQ: doctor.mrReference.HQ,
                REGION: doctor.mrReference.REGION,
                BUSINESSUNIT: doctor.mrReference.BUSINESSUNIT,
                DOJ: doctor.mrReference.DOJ,
            },
        }));

        return res.json(formattedDoctorsArray);
    } catch (error) {
        console.error(error);
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Internal Server Error', errorMessage });
    }
};


// const handleDoctorDataUnderAdmin = async (req, res) => {
//     try {
//         const adminId = req.params.id;

//         if (!mongoose.Types.ObjectId.isValid(adminId)) {
//             return res.status(400).json({ error: 'Invalid admin ID format' });
//         }

//         const adminData = await AdminModel.findById(adminId);

//         if (!adminData || !adminData.Mrs || adminData.Mrs.length === 0) {
//             return res.status(404).json({ error: 'Admin not found or has no related MR data' });
//         }

//         const mrIdsArray = adminData.Mrs.map(mr => mongoose.Types.ObjectId(mr._id));

//         const doctorsArray = await doctorModel.aggregate([
//             { $match: { mrReference: { $in: mrIdsArray } } },
//             {
//                 $lookup: {
//                     from: 'mrs',
//                     localField: 'mrReference',
//                     foreignField: '_id',
//                     as: 'mrData'
//                 }
//             },
//             {
//                 $unwind: '$mrData'
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     doctorName: 1,
//                     scCode: 1,
//                     city: 1,
//                     state: 1,
//                     locality: 1,
//                     speciality: 1,
//                     quizCategories: '$quizCategories',
//                     mrReference: {
//                         MRID: '$mrData.MRID',
//                         HQ: '$mrData.HQ',
//                         REGION: '$mrData.REGION',
//                         BUSINESSUNIT: '$mrData.BUSINESSUNIT',
//                         DOJ: '$mrData.DOJ',
//                     },
//                 }
//             }
//         ]);

//         return res.json(doctorsArray);
//     } catch (error) {
//         console.error(error);
//         const errorMessage = error.message;
//         return res.status(500).json({ message: 'Internal Server Error', errorMessage });
//     }
// };





module.exports = {
    handleAdminCreation,
    handleAdminLogin,
    handleAdminGet,
    handleUpdateAdmin,
    handleMrData,
    handleDoctorDataUnderAdmin
}





