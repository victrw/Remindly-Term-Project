const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

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

module.exports = router;
