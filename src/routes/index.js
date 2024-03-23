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

// * for vercel deploy:
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
        swagger:
          "https://personnel-api-ehkarabas.onrender.com/documents/swagger",
        redoc: "https://personnel-api-ehkarabas.onrender.com/documents/redoc",
        json: "https://personnel-api-ehkarabas.onrender.com/documents/json",
      },
    },
  });
});

module.exports = router;
