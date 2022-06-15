const express = require("express");
const cookieParser = require('cookie-parser')
const router = express.Router();
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {  username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_new", templateVars);
});

///// GO TO THE PAGE WITH ALL OF THE URLS SAVED

app.get("/urls", (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//// CREATE A SHORT SPECIFIC SHORT URL 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/" + shortURL);
     
});


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

//// CREATE A DELETE FUNCTION 

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect("/urls")

})

app.post("/urls/:shortURL/edit", (req,res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
  console.log(req.body)
  res.redirect("/urls/");

})

app.get("/urls/:shortURL/edit", (req,res) => {
 const templateVars = { username: req.cookies["username"],shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars)
})

////// CREATE A LOGIN

app.post("/urls/login", (req,res) => {

  const username = req.body.username
  console.log(username)
  res.cookie("username", username)
  console.log(req.cookies)
  console.log(req.body)
  res.redirect("/urls")


})








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
