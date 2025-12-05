const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  

  let booksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);  // Resolve with the books object
    }, 1000);         // Added delay only to simulate async work
  });

  console.log("Before calling promise");
  booksPromise.then((result) => {
    console.log("From Callback: Books data resolved");
    return res.status(200).json(result);
  });

  console.log("After calling promise");
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let isbnPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
  
        if (book) {
          resolve(book);       // Resolve with book details
        } else {
          reject("Book not found"); // Reject if no book for this ISBN
        }
  
      }, 1000);  // Delay only to simulate async work
    });
  
    console.log("Before calling promise");
  
    isbnPromise
      .then((book) => {
        console.log("From Callback: Promise resolved");
        return res.status(200).json(book);
      })
      .catch((error) => {
        return res.status(404).json({ message: error });
      });
  
    console.log("After calling promise");
 });


public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let authorPromise = new Promise((resolve, reject) => {
    setTimeout(() => {

      // Convert books object to array and filter
      let keys = Object.keys(books);
      let filteredBooks = keys
        .map(key => books[key])
        .filter(book => book.author === author);

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);  // Success
      } else {
        reject("No books found for this author"); // Failure
      }

    }, 1000); // Timeout only to simulate async
  });

  console.log("Before calling promise");

  authorPromise
    .then(data => {
      console.log("From Callback: Promise resolved");
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });

  console.log("After calling promise");
});


public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let titlePromise = new Promise((resolve, reject) => {
    setTimeout(() => {

      let keys = Object.keys(books);

      let filteredBooks = keys
        .map(key => books[key])
        .filter(book => book.title === title);

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);   // Found books
      } else {
        reject("No books found for this title"); // Not found
      }

    }, 1000);  // simulate async operation
  });

  console.log("Before calling promise");

  titlePromise
    .then(data => {
      console.log("From Callback: Promise resolved");
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });

  console.log("After calling promise");

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
