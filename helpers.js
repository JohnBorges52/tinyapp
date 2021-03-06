const generateRandomString = function() {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let joined = letters.split("");
  
  for (let i = 0; i < 6; i++) {
    result += joined[Math.floor(Math.random() * joined.length)];
  }
  return result;
  
};
const generateRandomID = function() {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let joined = letters.split("");
  
  for (let i = 0; i < 3; i++) {
    result += joined[Math.floor(Math.random() * joined.length)];
  }

  return result;
};
const emailLookUp = function(value,obj) {
 
  for (let key in obj) {
    if (obj[key].email === value) {
      return true;
    }
  }
  return false;
};
const getUserByEmail = function(value,obj) {

  for (let key in obj) {
    if (value === obj[key].email) {
      return obj[key].id;
    }
  }
};
const urlsForUser = function(id,obj) {
  const urls = {};
  
  for (let key in obj) {
    const url = obj[key];

    if (url.userID === id) {
      urls[key] = url;
    }
  }
  return urls;
};

module.exports = {
  generateRandomID,
  generateRandomString,
  emailLookUp,
  getUserByEmail,
  urlsForUser,
};