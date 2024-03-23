"use strict";
const router = require("express").Router();

// token routes
router.use("/auth", require("./authRoute"));

// department routes
router.use("/departments", require("./departmentRoute"));
// index.js dosyalari path'te belirtilmese de otomatik olarak calisir.

// personnel routes
router.use("/personnels", require("./personnelRoute"));

// token routes
router.use("/tokens", require("./tokenRoute"));

// Check functionality of userCheck middleware on root
router.all("/", (req, res) => {
  res.json({
    error: false,
    message: "WELCOME PERSONNEL API PROJECT",
    // ? Cookie Authentication
    // session: req.session,
    // user: req.user,
    // ? Token Authentication
    user: req.user,
    api: {
      documents: {
        swagger: "http://127.0.0.1:8000/documents/swagger",
        redoc: "http://127.0.0.1:8000/documents/redoc",
        json: "http://127.0.0.1:8000/documents/json",
      },
    },
  });
});

module.exports = router;
