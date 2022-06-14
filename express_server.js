const express = require("express");
const router = express.Router();
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  console.log(shortURL);
  res.redirect("/urls")

})

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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
