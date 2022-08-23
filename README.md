# TinyApp

TinyApp is a full-stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

_**Obs:** This is a project which aims backend practice, so it is not 100% mobile friendly and there are no CSS files. It is inline style and uses bootstrap to style the buttons and other parts of the project._

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
- Explore the website by registering an account and login in.

## FEATURES

- The user is able to register and login into the website.
- They can **CREATE** a new short URL to the website they want to visit. 
- The user is also able to **edit/update** the URL to a new one and **Delete** the URL altogether if they want.
- Only the users that created the shorted-URL are able to see their own URLs.
- The users' password is secure since the website is using the Bcrypt library.

## Final Product

<img src="https://user-images.githubusercontent.com/105023503/186245011-c90fad0e-3fb9-47d8-af41-f84be704b0e2.gif">

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
