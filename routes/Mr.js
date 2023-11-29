const express = require("express")
const router = express.Router();

const { createMr, loginMr, GetDoctorsByMR } = require("../controllers/Mr")


router.post("/create-mr", createMr);
router.post("/login-mr", loginMr);

router.get("/get-mr-doctors/:id", GetDoctorsByMR);



module.exports = router