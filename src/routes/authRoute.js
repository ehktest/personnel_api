"use strict";
const router = require("express").Router();

const Auth = require("../controllers/authController");

/* 
"_id": "65fb2df6674d4654f754e6ca",
"email": "testd0@site.com",
"password": "7c5bf6169525d03c909bae6d5274ea5ccd6dbec7f0aeb4abfaf4c81b8199b74a",
"username": "testdevops department0",
*/

router.post("/login", Auth.login).get("/logout", Auth.logout);
// ! swagger all method'unu desteklemez

module.exports = router;
