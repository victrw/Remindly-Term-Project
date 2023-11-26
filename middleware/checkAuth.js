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

  isAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      const user = userModel.findById(req.user.id);
      if (user && user.admin) {
        return next();
      }
    }
    res.redirect("/login");
  },
};
