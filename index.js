const express = require("express");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const { ensureAuthenticated, isAdmin } = require("./middleware/checkAuth")
const multer  = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


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


app.use(express.urlencoded({ extended: false }));

const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");
const expressLayouts = require("express-layouts");
const remindersController = require("./controller/reminder_controller");

//middleware
app.use(express.json());
app.use(expressLayouts);
app.use(passport.initialize());
app.use(passport.session());

// // error checking
// app.use((req, res, next) => {
//   console.log(`User details are: `);
//   console.log(req.user);

//   // console.log("Entire session object:");
//   // console.log(req.session);

//   // console.log(`Session details are: `);
//   // console.log(req.session.passport);
//   next();
// });

// Routes start here
app.get("/reminders", ensureAuthenticated, reminderController.list);
app.get("/reminder/new",  ensureAuthenticated, reminderController.new);
app.get("/reminder/:id", ensureAuthenticated, reminderController.listOne);
app.get("/reminder/:id/edit",  ensureAuthenticated, reminderController.edit);
app.post("/reminder/", upload.single('cover'), ensureAuthenticated, reminderController.create);
app.post("/reminder/update/:id",  ensureAuthenticated, reminderController.update);
app.post("/reminder/delete/:id",  ensureAuthenticated, reminderController.delete);
app.get("/register", authController.register);
app.post("/register", authController.registerSubmit);


//admin
app.get("/dashboard", isAdmin, ensureAuthenticated, reminderController.listActiveUser);
app.post("/dashboard", isAdmin, ensureAuthenticated, reminderController.revokeSession);
app.get("/revokeSession/:sessionId", reminderController.revokeSession)

//login
app.use(indexRoute);
app.use(authRoute);


app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/ in your browser 🚀"
  );
});


// admin use req.sessionStore