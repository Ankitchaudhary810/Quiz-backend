const express = require("express");
const router = express.Router();

const { handleAdminCreation, handleAdminLogin } = require("../controllers/admin")


router.route("/create-admin").post(handleAdminCreation);
router.route("/admin-login",).post(handleAdminLogin);




module.exports = router