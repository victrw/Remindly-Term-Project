const userModel = require("../models/userModel").userModel;

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.userAuth = req.isAuthenticated();
      return next();
    }
    res.redirect("/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/reminders");
  },

  isAdmin: function (req, res, next) {
    const userId = req.user.id;
    const user = userModel.findById(userId);
    
    if (user.admin) {
      return next();
    } else {
      console.error("Not an admin");
      res.redirect("/reminders");
    }
},
};
