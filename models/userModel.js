let database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    admin: false,
    reminders: [
      {
        id: 1,
        title: "Grocery shopping",
        description: "Buy milk and bread from safeway",
        completed: false,
      },
    ],    
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    admin: false,
    reminders: []
  },
  {
    id: 3,
    name: "victor",
    email: "v@gmail.com",
    password: "123",
    admin: true,
    reminders: [],
  },
  {
    id: 4,
    name: "Kris",
    email: "kris@gmail.com",
    password: "kris123",
    admin: true,
    reminders: [],
  },
];

const userModel = {
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    // add feature that alerts user that the email doesn't exist
    return null;
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    return null;
  },
};

module.exports = { database, userModel };
