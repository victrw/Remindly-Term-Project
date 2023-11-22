let { database, userModel }= require("../models/userModel");

let remindersController = {
  list: (req, res) => {
    if (req.user) {
      res.render("reminder/index", { reminders: req.user.reminders || [] });
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
      res.redirect("/reminder/index");
    } else {
      res.redirect("/reminder/index");
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
      completed: false,
    };
    let reminderIndex = req.user.reminders.findIndex(function (reminder) {
      return reminder.id == reminderToUpdate;
    });
    if (reminderIndex != -1) {
      req.user.reminders[reminderIndex] = {
        id: reminderToUpdate,
        ...updatedReminder,
      };
      res.redirect("/reminder/index");
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
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
    res.redirect("/reminder/index");
  },
};

module.exports = remindersController;
