const express = require("express");
const cookieParser = require('cookie-parser')
const router = express.Router();
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const res = require("express/lib/response");

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

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
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
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
  const cookiesID = req.cookies["user_id"]
  const templateVars = { userID: users[req.cookies["user_id"]], urls: urlDatabase }
  
  if (cookiesID) {
    
    res.render("urls_index", templateVars)
    }
   else {
    res.status(400).send("ERROR. YOU ARE NOT LOGGED IN")
  }
 
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
   
  if (array.includes(shortURL)) {
    const longURL = urlDatabase[shortURL].longURL
    res.redirect(longURL);    
  } else {
      res.status(404).send("page does not exist")
    } 
  
});

//// CREATE A DELETE FUNCTION 

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect("/urls")

})
//// ROUTE TO EDIT THE LONG_URL
app.post("/urls/:shortURL/edit", (req,res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
 
  res.redirect("/urls/");

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
  

  if (!emailLookUp(email,users)) {
    return res.status(403).send("EMAIL NOT FOUND IN THE DATABASE")
  };
  if (emailLookUp(email,users) && !passwordLookUp(password,users)) {
    return res.status(403).send("WRONG PASSWORD")

  }

  const id = retrieveID(email, users)
  res.cookie("user_id", id)
  res.redirect("/urls")
  
})

////// ROUTE TO LOG OUT //////
app.post("/logout", (req,res) => {

  res.clearCookie("user_id")
  res.redirect("/urls")
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
  
  if (email.length === 0 || password.length ===  0) {
    return res.status(400).send("E-Mail or Password Invalid");
  }

  if (emailLookUp(email, users) === true ) {
    return res.status(400).send("ERROR 400 EMAIL ALREADY EXIST")
  };
  
  users[randomID] = {
    id: randomID,
    email,
    password
  }
  console.log(users)
  res.redirect("/urls")
  
})

////here
const urlForUser = function(id,obj) {
  for(let key in obj) {
    if (obj[key].userID === id) {
       return true
    }
  }
  return false
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

