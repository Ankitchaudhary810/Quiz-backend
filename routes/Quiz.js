const express = require("express")
const router = express.Router();

const {postDrData, getDoctorName , getOnlyName} = require("../controllers/Quiz")

router.post("/user" , postDrData);
router.get("/get/docter/name" , getDoctorName);
router.get("/get/names" , getOnlyName);



module.exports = router;