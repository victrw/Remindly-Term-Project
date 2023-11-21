let database = require("../database");

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
    let user = database.users.find((user) => user.email === email);
    if (user) {
      res.redirect("/register");
    } else {
      database.users.push({
        id: database.users.length + 1,
        email: email,
        password: password,
      });
      res.redirect("/login");
    }
  },
};

module.exports = authController;
