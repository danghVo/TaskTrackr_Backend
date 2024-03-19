const express = require("express");
const router = express.Router()
const user = require("../controllers/user.controllers");

router.route("/signin")
    .post(user.createUser)

router.route("/login/:username/:password")
    .get(user.checkLogIn)

module.exports = router;