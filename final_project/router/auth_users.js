const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Przechowujemy użytkowników w tablicy w pamięci (dla przykładu)
let users = [
  { username: "exampleUser", password: "examplePass" }
];

// Sprawdza istnienie użytkownika o danym username
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Sprawdza poprawność loginu i hasła użytkownika
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Endpoint rejestracji użytkownika
regd_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(400).json({message: "User already exists!"});
  }

  users.push({ username, password });
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Endpoint logowania
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, user: username };
    return res.status(200).json({message: "User successfully logged in", accessToken: accessToken});
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});

// Dodawanie recenzji (autoryzacja wymagana)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization ? req.session.authorization.user : null;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added/updated successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Usuwanie recenzji (autoryzacja wymagana)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? req.session.authorization.user : null;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  } else {
    return res.status(404).json({message: "Book or review not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
