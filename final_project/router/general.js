const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});


// Get the book list available in the shop
public_users.get('/', function(req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  console.log(isbn, Object.keys(books));
  const book = books[String(isbn)];
  if(book){
    return res.json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author.toLowerCase();
  let matchingBooks = [];
  const allBooks = Object.values(books);
  for (let book of allBooks) {
    if (book.author.toLowerCase() === authorParam) {
      matchingBooks.push(book);
    }
  }
  if (matchingBooks.length > 0) {
    return res.json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found for the given author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title.toLowerCase();
  let matchingBooks = [];
  const allBooks = Object.values(books);
  for (let book of allBooks) {
    if (book.title.toLowerCase() === titleParam) {
      matchingBooks.push(book);
    }
  }
  if (matchingBooks.length > 0) {
    return res.json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found with the given title"});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book or reviews not found"});
  }
});

module.exports.general = public_users;
