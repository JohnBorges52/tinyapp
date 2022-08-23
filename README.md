# TinyApp

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

_This is a project which aims backend practice, so it is not 100% mobile friendly and there are no css files. It is inline style and use bootstrap to style the buttons and other parts of the project._

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
- Explore the website registering and loggin in.

## FEATURES

The user is able to register and log in into the web-site. 
They can **CREATE** a new short url to the website they want to visit. 
The user is also able to **edit/update** the url to a new one and **Delete** the url all together if they want.
Only the users that created the shorted-url are able to see their own urls.
The users password is secure since the website is using the Bcrypt library.

## Final Product

<img src="https://user-images.githubusercontent.com/105023503/186245011-c90fad0e-3fb9-47d8-af41-f84be704b0e2.gif">

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
