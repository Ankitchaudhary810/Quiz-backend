const express = require("express")
const router = express.Router();
const multer = require('multer');

const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const { createMr, loginMr, GetDoctorsByMR, handleSheetUpload, handleAdminSideReports, handleAllMrDoctorsData, handleAllMrDoctorsDataV2, handleForgetPassword, handleTopMrByDoctor, handleTopCategoryChart, handleTop20Mr } = require("../controllers/Mr")


router.post("/create-mr", createMr);
router.post("/login-mr", loginMr);
router.get("/get-mr-doctors/:id", GetDoctorsByMR);
// router.post("/upload-sheet/:id", upload.single('file'), handleSheetUpload);



router.get("/admin-side-reports", handleAdminSideReports);

router.get("/get-all-doctor-mrs-data", handleAllMrDoctorsData);
router.get("/v2/get-all-doctor-mrs-data", handleAllMrDoctorsDataV2);
router.post("/forget-mr-password", handleForgetPassword);
router.get("/top-mr-by-doctor", handleTopMrByDoctor);
router.get("/top-category-chart", handleTopCategoryChart);



router.get("/get-top-20-mrs", handleTop20Mr);





module.exports = router