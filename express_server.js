const express = require("express");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

const router = express.Router();
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const res = require("express/lib/response");

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["a","lot","of,","keys"],
})

const urlDatabase = {
  "b2xVn2":{
    longURL:"http://www.lighthouselabs.ca",
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
}


app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls/new", (req, res) => {
  const templateVars = {  userID: users[req.cookies["user_id"]], urls: urlDatabase };
  res.render("urls_new", templateVars);
});


//// ADD A SHORT URL DO THE DATABASE //// 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL

  const cookies = users[req.cookies["user_id"]]

  if (cookies) {  
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: cookies.id};
      res.redirect("/urls/" + shortURL);
  } else {
    return res.status(401).send("ERROR, YOU MUST BE SIGNED INTO YOUR ACCOUNT")
  }    
});

///// GO TO THE PAGE WITH ALL OF THE URLS SAVED

app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"]

  if (!userID) {
    return res.status(400).send("ERROR. YOU ARE NOT LOGGED IN");
  }

  const urls = urlsForUser(userID);


  const templateVars = {userID, urls};
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {

  const templateVars = { 
    userID: users[req.cookies["user_id"]],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]};


  res.render("urls_show", templateVars);
});


 app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL 
 
  const array = Object.keys(urlDatabase)  
   
  if (!array.includes(shortURL)) {
    res.status(404).send("page does not exist")
  }
 
  const longURL = urlDatabase[shortURL].longURL
 

  res.redirect(longURL)

  
 });

//// CREATE A DELETE FUNCTION 

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = users[req.cookies["user_id"]];
  
  
  if (!userID) {
    return res.status(401).send("UNAUTHORIZED TO MAKE CHANGES")
  }

  delete urlDatabase[shortURL]
 
  res.redirect("/urls")


})


//// ROUTE TO EDIT THE LONG_URL

app.post("/urls/:shortURL/edit", (req,res) => {
  
  const shortURL = req.params.shortURL;
  
  const userID = users[req.cookies["user_id"]];

  if (!userID) {
    return res.status(401).send("UNAUTHORIZED TO MAKE CHANGES")
  }
  urlDatabase[shortURL].longURL = req.body.longURL;
  
  longURL = urlDatabase[shortURL].longURL
 
  
  
  res.redirect("/urls/",shortURL);

})

//// ROUTE TO GO TO THE EDIT PAGE

app.get("/urls/:shortURL/edit", (req,res) => {
 const templateVars = { userID: users[req.cookies["user_id"]],
 shortURL: req.params.shortURL,
 longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars)
})




//// ROUTE TO THE LOGIN PAGE //////
app.get("/login", (req,res) => {
  const templateVars = {userID: users[req.cookies["user_id"]]};
  res.render("login", templateVars);

})


app.post("/login", (req,res) => {

  const email = req.body.email;
  const password = req.body.password;
  
 
  const ID = retrieveID(email, users);

  if (!emailLookUp(email,users)) {
    return res.status(403).send("EMAIL NOT FOUND IN THE DATABASE")
  };

  if (bcrypt.compareSync(password,users[ID].password) === false) {
    return res.send("WRONG PASSWORD!!")
  }

  
  res.cookie("user_id", ID)
  res.redirect("/urls")
  
})

////// ROUTE TO LOG OUT //////
app.post("/logout", (req,res) => {

  res.clearCookie("user_id")
  res.redirect("/login")   /////////////CHANGE HERE TO URLS BEFORE FINISHING
})


///// ROUTE TO GO TO REGISTRATION PAGE //////
  app.get("/register", (req,res) => {
  const templateVars = {userID: users[req.cookies["user_id"]]}
  res.render('register', templateVars)
  
})

///// ROUTE TO ADD A NEW USER /////

app.post("/newUser" , (req, res) => {
  const randomID = generateRandomID();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  if (email.length === 0 || password.length ===  0) {
    return res.status(400).send("E-Mail or Password Invalid");
  }

  if (emailLookUp(email, users) === true ) {
    return res.status(400).send("ERROR 400 EMAIL ALREADY EXIST")
  };
  
  users[randomID] = {
    id: randomID,
    email,
    password : hashedPassword,
  }
  console.log(users)
  res.redirect("/login")    ///////CHANGE HERE BEFORE FINISHING TO URLS  
})

const urlsForUser = function(id) {
  const urls = {};
  
  for (let key in urlDatabase) {
    const url = urlDatabase[key];
  
    if (url.userID === id) {
      urls[key] = url;
    }
  
  }

  return urls;


};















app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString() {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = '';
  let joined = letters.split("")
  for (let i = 0; i < 6; i++) {
    
  
    result += joined[Math.floor(Math.random() * joined.length)];
  
  
  }
  return result
  
}
  
function generateRandomID() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = '';
    let joined = letters.split("")
    for (let i = 0; i < 3; i++) {
      
    
      result += joined[Math.floor(Math.random() * joined.length)];
    
    
    }
    return result
}
function emailLookUp(value,obj) {
    
  for (let key in obj) {
    if (obj[key].email === value) {
      return true;
    }
  }
  return false;
}
function passwordLookUp(value,obj) {
    
  for (let key in obj) {
    if (obj[key].password === value) {
      return true;
    }
  }
  return false;
}
function retrieveID(value,obj) {
  for (let key in obj) {
    if (value === obj[key].email){
      return obj[key].id
    }
  }
}

