const express = require("express");
const passport = require("../middleware/passport");
const { ensureAuthenticated, forwardAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { userModel } = require("../models/userModel");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("auth/login");
});


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
});


router.get("/dashboard", isAdmin, (req, res) => {
  res.render("auth/dashboard");
});


module.exports = router;
