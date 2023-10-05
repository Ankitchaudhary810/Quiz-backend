const express = require("express")
const router = express.Router();

const {postDrData, getDoctorName , handleUserDataById , handleUserQuizSubmit} = require("../controllers/Quiz")

router.post("/user" , postDrData);
router.get("/get/docter/name" , getDoctorName);
router.post("/get/users" , handleUserDataById);
router.post("/submit/score" , handleUserQuizSubmit);



module.exports = router;