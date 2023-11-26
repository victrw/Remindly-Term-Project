const express = require("express");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const { ensureAuthenticated, forwardAuthenticated, isAdmin } = require("./middleware/checkAuth")

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


// admin dashboard
app.get("/dashboard", isAdmin, (req, res) => {
  console.log(`Req Session`, req.session);
  res.render("auth/dashboard", { user: req.user, session: req.session  });
});

app.post("/dashboard/revoke", isAdmin, (req, res) => {
  const userIdRevoke = req.params.userId;
  req.sessionStore.destroy(userIdRevoke, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");}
  });
});

// // error checking
app.use((req, res, next) => {
  // console.log(`User details are: `);
  // console.log(req.user);

  // console.log("Entire session object:");
  // console.log(req.session);

  console.log(`Session details are: `);
  // console.log(req.session.passport);
  const sample = req.sessionStore.all((err, sessions) => {
    if (err) { console.log(err) }
    console.log(sessions);
  });
  next();
});

// Routes start here
app.get("/reminders", ensureAuthenticated, reminderController.list);
app.get("/reminder/new",  ensureAuthenticated, reminderController.new);
app.get("/reminder/:id",  ensureAuthenticated, reminderController.listOne);
app.get("/reminder/:id/edit",  ensureAuthenticated, reminderController.edit);
app.get("/dashboard", isAdmin, reminderController.admin);
app.post("/reminder/",  ensureAuthenticated, reminderController.create);
app.post("/reminder/update/:id",  ensureAuthenticated, reminderController.update);
app.post("/reminder/delete/:id",  ensureAuthenticated, reminderController.delete);
app.get("/register", authController.register);
app.post("/register", authController.registerSubmit);


app.use(indexRoute);
app.use(authRoute);

// app.use("/", indexRoute);
// app.use("/login", authRoute);
// app.get("/login", authController.login);
// app.post("/login", authController.loginSubmit);

app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/ in your browser 🚀"
  );
});


// admin use req.sessionStore