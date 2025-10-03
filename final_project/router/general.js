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
  const newPromoise=new Promise((resolve, reject) => {
    resolve(books);
  })
  newPromoise.then((books) => {res.status(200).json(books)})
  .catch((err) => {res.status(500).json({message: "Error retrieving book list"})
})});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  const book = books[String(isbn)];
  let newPromis = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(book);
    }, 1000);
  });
  newPromis.then((book) => {
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  }).catch((err) => {
    res.status(500).json({ message: "Error retrieving book details" });
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author.toLowerCase();
  let matchingBooks = [];
  const allBooks = Object.values(books);
  
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(allBooks);
    }, 1000);
  });

  promise.then((allBooks) => {
    for (let book of allBooks) {
      if (book.author.toLowerCase() === authorParam) {
        matchingBooks.push(book);
      }
    }
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({message: "No books found for the given author"});
    }
  })
  .catch(() => {
    res.status(500).json({message: "Error retrieving book list"});
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title.toLowerCase();
  let matchingBooks = [];
  const allBooks = Object.values(books);
  let newPromis = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(allBooks);
    }, 1000);
  });

  newPromis.then((allBooks) => {
    for (let book of allBooks) {
      if (book.title.toLowerCase() === titleParam) {
        matchingBooks.push(book);
      } }
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({message: "No books found with the given title"});
    } })
  .catch(() => {
    res.status(500).json({message: "Error retrieving book list"});
  }); 
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
