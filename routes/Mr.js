const express = require("express")
const router = express.Router();
const multer = require('multer');

const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const { createMr, loginMr, GetDoctorsByMR, handleSheetUpload } = require("../controllers/Mr")


router.post("/create-mr", createMr);
router.post("/login-mr", loginMr);
router.get("/get-mr-doctors/:id", GetDoctorsByMR);
router.post("/upload-sheet", upload.single('file'), handleSheetUpload);




module.exports = router