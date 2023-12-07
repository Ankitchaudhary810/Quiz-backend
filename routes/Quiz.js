const express = require("express")
const router = express.Router();

const { postDrData, getDoctorName, handleUserDataById, handleUserQuizSubmit, handleLeaderBoardFilter, handleLeaderFilterByCategoryName, handleUsersStateAndName, handleOnlyNameWithId, handleUserCategory, handleUserCategoryWithQuestion } = require("../controllers/Quiz")



router.post("/user", postDrData);
router.get("/get/docter/name", getDoctorName);
router.get("/get/users/:userId", handleUserDataById);
router.post("/submit/score", handleUserQuizSubmit);
router.post("/get/filter/leaderboard", handleLeaderBoardFilter);
router.get("/get/leaderboard/:categoryName", handleLeaderFilterByCategoryName);
router.get("/get/users-name-state-city", handleUsersStateAndName);
router.post('/get/get-only-name-with-id', handleOnlyNameWithId);

router.get("/get/user-category/:userId", handleUserCategory);

router.get("/get/user-category-with-mulquestions-fourquestions/:userId", handleUserCategoryWithQuestion)


module.exports = router;