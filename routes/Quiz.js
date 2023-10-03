const express = require("express")
const router = express.Router();

const {postDrData, getDoctorName} = require("../controllers/Quiz")

router.post("/user" , postDrData);
router.get("/get/docter/name" , getDoctorName);



module.exports = router;