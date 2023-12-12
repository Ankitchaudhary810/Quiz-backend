const express = require("express")
const router = express.Router();
const multer = require('multer');

const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const { createMr, loginMr, GetDoctorsByMR, handleSheetUpload, handleAdminSideReports } = require("../controllers/Mr")


router.post("/create-mr", createMr);
router.post("/login-mr", loginMr);
router.get("/get-mr-doctors/:id", GetDoctorsByMR);
router.post("/upload-sheet", upload.single('file'), handleSheetUpload);



router.get("/admin-side-reports", handleAdminSideReports);



module.exports = router