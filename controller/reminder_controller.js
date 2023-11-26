let { database, userModel }= require("../models/userModel");

let remindersController = {
  list: (req, res) => {
    if (req.user) {
      res.locals.userAdmin = req.user.admin;
      res.render("reminder/index", { reminders: req.user.reminders});
    }
  },


  new: (req, res) => {
    res.render("reminder/create");
  },


  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
    }
  },


  create: (req, res) => {
    if (req.user) {
      let reminder = {
        id: req.user.reminders.length + 1,
        title: req.body.title,
        description: req.body.description,
        completed: false,
      };
      req.user.reminders.push(reminder);
      res.redirect("/reminders");
    } else {
      res.redirect("/reminders");
    }
  },


  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },


  update: (req, res) => {
    let reminderToUpdate = req.params.id;
    let updatedReminder = {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed == "true",
    };
    let reminderIndex = req.user.reminders.findIndex(function (reminder) {
      return reminder.id == reminderToUpdate;
    });
    if (reminderIndex != -1) {
      req.user.reminders[reminderIndex] = {
        id: reminderToUpdate,
        ...updatedReminder,
      };
      res.redirect("/reminders");
    } else {
      res.render("reminders/index", { reminders: req.user.reminders });
    }
  },

  delete: (req, res) => {
    let reminderToDel = req.params.id;
    let reminderIndex = req.user.reminders.findIndex(function (reminder) {
      return reminder.id == reminderToDel;
    });
    if (reminderIndex != -1) {
      req.user.reminders.splice(reminderIndex, 1);
    }
    res.redirect("/reminders");
  },

  listActiveUser: (req, res) => {
    let activeUsers = [];
    res.locals.activeUsers = activeUsers;
    const sessions = req.sessionStore.all((err, sessions) => {
      if (err) {
        console.log(err);
      } else {
        const sessionArray = Object.values(sessions);
        sessionArray.forEach((session) => {
          if (session.passport) {
            activeUsers.push({
              sessionID: session.id,
              userID: session.passport.user,
            });
          }
        });
        console.log(activeUsers)
        res.render("auth/dashboard", { user: req.user, session: req.session });
      }
    });
  },
  

  revokeSession: (req, res) => {
    const sessionIdRevoke = req.params.sessionId;
    req.sessionStore.destroy(sessionIdRevoke, (err) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect("/login");
      }
    });
  },
};

module.exports = remindersController;
