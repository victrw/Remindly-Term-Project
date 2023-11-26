let { database } = require("../models/userModel");
let userController = require("./userController");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res) => {
    const { email, password } = req.body;
    let user = database.users.find((user) => user.email === email);
    if ( user && user.password === password ) {
      req.session.user = user;
      res.redirect("/reminders");
    } else {
      res.redirect("/login");
    }
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
        reminders: [],
      };
      database.push(newUser);
      console.log("User created successfully")
      res.redirect("/login");
    }
  }};

module.exports = authController;
