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
        cover: "",
      };
      if (req.file) {
        reminder.cover = req.file.path.slice(6)
      };
      if (req.body.randomcover === "on") {
        fetch("https://api.unsplash.com/photos/random/?client_id=Ys783iZMcEepRik4H7SAIW4K4KFtBrmbGdEyxnGOpMA")
        .then(response => response.json())
        .then(data => {
            reminder.cover = data.urls.full
        })
        .catch((err) => console.error(err))
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
    req.sessionStore.all((err, sessions) => {
      if (err) {
        console.log(err);
      } else {
        const sessionData = Object.keys(sessions);
        sessionData.forEach((sessionId) => {
          const session = sessions[sessionId];
          if (session.passport) {
            activeUsers.push({
              sessionID: sessionId,
              userID: session.passport.user,
            });
          }
        });
        // console.log(activeUsers);
        res.locals.activeUsers = activeUsers;
        res.render("auth/dashboard", { user: req.user });
      }
    });
  },
  
  
  revokeSession: (req, res) => {
    const sessionIdRevoke = req.params.sessionId;
    console.log("Revoking session", sessionIdRevoke);
    req.sessionStore.destroy(sessionIdRevoke, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Session revoked");
        res.redirect("/dashboard");
      }
    });
  },
};


module.exports = remindersController;
