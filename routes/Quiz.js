const express = require("express")
const router = express.Router();

const {postDrData, getDoctorName , getOnlyName , handleUserQuizSubmit} = require("../controllers/Quiz")

router.post("/user" , postDrData);
router.get("/get/docter/name" , getDoctorName);
router.get("/get/names" , getOnlyName);
router.post("/submit/score" , handleUserQuizSubmit);



module.exports = router;