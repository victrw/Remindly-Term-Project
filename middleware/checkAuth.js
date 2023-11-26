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
    const sessions = req.sessionStore.all();

    console.log("User", user);
    console.log("User ID", userId);
    console.log("SessionId", req.sessionID);

    req.sessions = sessions;

    if (user.admin == "true") {
      res.locals.user = req.body.admin;
      res.render("auth/dashboard", { user: req.user, session: req.session });
    } else {
      console.error("Not an admin");
      res.redirect("/login");
    }
  },
};


// store.all(callback)
// store.destory
