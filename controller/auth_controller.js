let { database } = require("../models/userModel");
let userController = require("./userController");

let authController = {

  register: (req, res) => {
    res.render("auth/register");
  },

  registerSubmit: (req, res) => {
    const { email, password } = req.body;
  
    const checkingUser = userController.getUserByEmailIdAndPassword(email, password);
  
    if (checkingUser) {
      // add a alert message here
      res.render("auth/register");
    } else {
      const newUser = {
        id: database.length + 1,
        email: email,
        password: password,
        admin: false,
        reminders: [],
      };
      database.push(newUser);
      console.log("User created successfully")
      res.redirect("/login");
    }
  }};



module.exports = authController;
