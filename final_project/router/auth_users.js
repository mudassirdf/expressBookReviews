const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in, provide username and password" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;  

    if (!review) {
        return res.status(400).send({ message: "Review is required as a query parameter." });
    }
    if (!username) {
    return res.status(401).send({ message: "User must be logged in to post a review." });
    }
    const book = books[isbn];
    if (!book) {
        return res.status(404).send({ message: "Book not found." });
    }
    if (!book.reviews) {
        book.reviews = {};
    }
    book.reviews[username] = review;
    res.status(200).send({
        message: "Review added successfully!",
        reviews: book.reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!username) {
        return res.status(401).send({ message: "User must be logged in to delete a review." });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).send({ message: "Book not found." });
    }

    // Ensure reviews is an object
    if (!book.reviews || typeof book.reviews !== "object") {
        return res.status(404).send({ message: "No reviews found for this book." });
    }

    // Check if this user has a review to delete
    if (!book.reviews[username]) {
        return res.status(403).send({ 
            message: "You can delete only your own review or review does not exist." 
        });
    }

    // Delete only the user's review
    delete book.reviews[username];

    return res.status(200).send({
        message: "Your review has been deleted successfully.",
        reviews: book.reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
