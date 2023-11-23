const express = require("express");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const { ensureAuthenticated, forwardAuthenticated } = require("./middleware/checkAuth")

const app = express();
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");
const expressLayouts = require("express-layouts");



//middleware
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

// Routes start here
app.get("/reminders", ensureAuthenticated, reminderController.list);
app.get("/reminder/new",  ensureAuthenticated, reminderController.new);
app.get("/reminder/:id",  ensureAuthenticated, reminderController.listOne);
app.get("/reminder/:id/edit",  ensureAuthenticated, reminderController.edit);
app.post("/reminder/",  ensureAuthenticated, reminderController.create);
app.post("/reminder/update/:id",  ensureAuthenticated, reminderController.update);
app.post("/reminder/delete/:id",  ensureAuthenticated, reminderController.delete);


app.use(indexRoute);
app.use(authRoute);
// app.use("/", indexRoute);
// app.use("/login", authRoute);
// app.get("/register", authController.register);
// app.get("/login", authController.login);
// app.post("/register", authController.registerSubmit);
// app.post("/login", authController.loginSubmit);

app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/ in your browser 🚀"
  );
});


// admin use req.sessionStore