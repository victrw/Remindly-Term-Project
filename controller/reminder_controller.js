let { database, userModel }= require("../models/userModel");

let remindersController = {
  list: (req, res) => {
    const userID = req.user.id;
    const user = userModel.findById(userID);

    if (user) {
      res.render("reminder/index.ejs", { reminders: user.reminders || [] });
    } else {
      res.render("reminder/index.ejs", { reminders: [] });
    }
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database[0].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index.ejs", { reminders: database[0].reminders });
    }
  },

  create: (req, res) => {
    const userID = req.user.id;
    const user = userModel.findById(userID);

    if (user) {
      let reminder = {
        id: user.reminders.length + 1,
        title: req.body.title,
        description: req.body.description,
        completed: false,
      };
      user.reminders.push(reminder);
      res.redirect("/reminders");
    } else {
      res.redirect("/reminders");
    }
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database[0].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    let reminderToUpdate = req.params.id;
    let updatedReminder = {
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    let reminderIndex = database[0].reminders.findIndex(function (reminder) {
      return reminder.id == reminderToUpdate;
    });
    if (reminderIndex != -1) {
      database[0].reminders[reminderIndex] = {
        id: reminderToUpdate,
        ...updatedReminder,
      };
      res.redirect("/reminders");
    } else {
      res.render("reminder/index.ejs", { reminders: database[0].reminders });
    }
  },

  delete: (req, res) => {
    let reminderToDel = req.params.id;
    let data = database[0].reminders.findIndex(function (reminder) {
      return reminder.id == reminderToDel;
    });
    database[0].reminders.splice(data, 1);
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
