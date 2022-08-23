//// HELPER FUNCTIONS ////
const {
  generateRandomID,
  generateRandomString,
  emailLookUp,
  getUserByEmail,
  urlsForUser
} = require("./helpers");

/// IMPORT OF LIBRARIES ///

const express = require("express");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

//// IMPLEMENTATION OF MIDDLEWARES ////
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["a", "lot", "of,", "keys"],
}));


//// URL DATABASE ////
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "aJ48lW"
  }
};

/////USERS DATABASE
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "123"
  },
  "user": {
    id: "user",
    email: "a@a.com",
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
let registerError = false;
let loginError = false;
let message = "";

//// HOMEPAGE ////
app.get("/", (req, res) => {
  error = false
  registerError = false
  res.redirect("/login");
});

//// ROUTER TO CREATE A NEW URL ////
app.get("/urls/new", (req, res) => {
  const templateVars = { userID: req.session.user_id, urls: urlDatabase, username: users[req.session.user_id] };

  if (!templateVars.userID) {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

//// ADD THE SHORT URL DO THE DATABASE ////
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(401).send("ERROR, YOU MUST BE SIGNED INTO YOUR ACCOUNT");
  }

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userID
  };

  res.redirect("/urls/" + shortURL);
});

///// GO TO THE PAGE WITH ALL OF THE URLS SAVED
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(400).send("ERROR. YOU ARE NOT LOGGED IN");
  }

  const urls = urlsForUser(userID, urlDatabase);
  const templateVars = { userID, urls, username: users[req.session.user_id] };
  res.render("urls_index", templateVars);
});

////  GO TO THE PAGE OF THE CREATED SHORT URL /////
app.get("/urls/:shortURL", (req, res) => {

  const templateVars = {
    userID: req.session.user_id,
    username: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };

  if (templateVars.userID !== urlDatabase[templateVars.shortURL].userID) {
    res.status(401).send("ERROR. User no authorized to access url.");
  }

  res.render("urls_show", templateVars);
});

///// LINK THAT GOES TO THE LONG URL /////
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const array = Object.keys(urlDatabase);

  if (!array.includes(shortURL)) {
    res.status(404).send("page does not exist");
  }

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//// DELETE A URL ///
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(401).send("UNAUTHORIZED TO MAKE CHANGES");
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//// EDIT THE LONG URL IN THE DATABASE ////
app.post("/urls/:shortURL/edit", (req, res) => {

  const shortURL = req.params.shortURL;

  const userID = req.session.user_id;

  if (!userID) {
    return res.status(401).send("UNAUTHORIZED TO MAKE CHANGES");
  }
  urlDatabase[shortURL].longURL = req.body.longURL;

  res.redirect("/urls/");

});

//// ROUTE TO GO TO THE EDIT PAGE ////
app.get("/urls/:shortURL/edit", (req, res) => {
  const templateVars = {
    userID: req.session.user_id,
    username: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };

  res.render("urls_show", templateVars);
});

//// ROUTE TO THE LOGIN PAGE //////
app.get("/login", (req, res) => {
  const templateVars = { userID: req.session.user_id, loginError: loginError, message: message };
  registerError = false
  res.render("login", templateVars);
});

//// ACCESS THE DATABASE IN ORDER TO LOGIN ////
app.post("/login", (req, res) => {
  const templateVars = { userID: req.session.user_id, username: users[req.session.user_id], registerError: registerError, message: message };
  const email = req.body.email;
  const password = req.body.password;
  const ID = getUserByEmail(req.body.email, users);


  if (!emailLookUp(email, users)) {
    loginError = true;
    message = "EMAIL NOT FOUND IN THE DATABASE"
    res.redirect("/login", templateVars);

  }


  if (bcrypt.compareSync(password, users[ID].password) === false) {
    loginError = true;
    message = "WRONG PASSWORD"
    res.redirect("/login")
  }


  req.session.user_id = users[ID].id;
  res.redirect("/urls");
});

////// ROUTE TO LOG OUT //////
app.post("/logout", (req, res) => {

  req.session = null;
  loginError = false
  registerError = false
  res.redirect("/login");
});


///// ROUTE TO GO TO REGISTRATION PAGE //////
app.get("/register", (req, res) => {
  const templateVars = { userID: req.session.user_id, username: users[req.session.user_id], registerError: registerError, message: message };
  loginError = false
  res.render('register', templateVars);
});

///// REGISTER A NEW USER TO DATABASE /////
app.post("/newUser", (req, res) => {
  const randomID = generateRandomID();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email.length === 0 || password.length === 0) {
    registerError = true
    message = "E-Mail or Password Invalid";
    res.redirect('/register')
  }

  if (emailLookUp(email, users) === true) {
    registerError = true
    message = "ERROR 400 EMAIL ALREADY EXIST";
    res.redirect('/register')
  }

  users[randomID] = {
    id: randomID,
    email,
    password: hashedPassword,
  };
  res.redirect("/login");
});

////// CONSOLE.LOG IF THE SERVER IS UP ////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



