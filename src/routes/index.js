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

// * for deploy:
// Check functionality of userCheck middleware on root
router.all("/", (req, res) => {
  const scheme = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const basePath = `${scheme}://${host}`;
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
        swagger: `${basePath}/documents/swagger`,
        redoc: `${basePath}/documents/redoc`,
        json: `${basePath}/documents/json`,
      },
    },
  });
});

module.exports = router;
