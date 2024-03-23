"use strict";

const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  if (req?.session?.id) {
    const { id, password } = req.session;
    const user = await User.findById(id);
    // ? if password changed, log user out
    if (user && user.pass === password) {
      // set req.user to user and req.isLogin to true
      req.user = user;
      req.isLogin = true;
      // ? set user as admin if email matches -> handled on personnel login controller
      // if (user.email === "admin@aa.com") {
      //   req.session.isAdmin = true;
      // } else {
      //   req.session.isAdmin = false;
      // }
    } else {
      // clear session data and set req.isLogin to false
      req.session = null;
      req.isLogin = false;
    }
  }
  next();
};

// route'lardan once index.js'e eklenecek middleware
// Login/Logout Control Middleware
// app.use(async (req, res, next) => {

//   const Personnel = require('./src/models/personnel.model')

//   req.isLogin = false

//   if (req.session?.id) {

//       const user = await Personnel.findOne({ _id: req.session.id })

//       // if (user && user.password == req.session.password) {
//       //     req.isLogin = true
//       // }
//       req.isLogin = user && user.password == req.session.password
//   }
//   console.log('isLogin: ', req.isLogin)

//   next()
// })
