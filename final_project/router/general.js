const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 10));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let keys = Object.keys(books);

  // 2. Iterate and match author
  let filteredBooks = keys
    .map(key => books[key])              // convert to array of book objects
    .filter(book => book.author === author); // match based on author

  // If no books found
  if (filteredBooks.length === 0) {
    return res.status(404).send({ message: "No books found for this author" });
  }

  res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let keys = Object.keys(books);

  let filteredBooks = keys
    .map(key => books[key])              // convert to array of book objects
    .filter(book => book.title === title); // match based on title

  // If no books found
  if (filteredBooks.length === 0) {
    return res.status(404).send({ message: "No books found for this title" });
  }

  res.send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

  // Directly access the book using ISBN as key
  const book = books[isbn];

  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }

  // Return only the reviews
  res.send(book.reviews);
});

module.exports.general = public_users;
