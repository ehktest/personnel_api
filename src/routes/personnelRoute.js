"use strict";
const router = require("express").Router();

const personnel = require("../controllers/personnelController");
const permissions = require("../middlewares/permissions");
// const CustomError = require("../errors/customError");
const idValidation = require("../middlewares/idValidation");

// Personnel:
// ! swagger route regex'lerle saglikli calismamaktadir. orn: (\\w+). idValidation middleware'i varsa kullanilmayabilir.
router
  .route("/:personnelId")
  .all(idValidation)
  // ? get single
  .get(permissions.isLeadAdminOrOwn, personnel.read)
  // ? update
  .put(permissions.isAdminOrOwn, personnel.update)
  .patch(permissions.isAdminOrOwn, personnel.update)
  // .patch(personnel.update)
  // ? delete
  .delete(permissions.isAdmin, personnel.destroy);

router
  .route("/")
  // ? get all
  .get(permissions.isAdmin, personnel.list)
  // ? create
  .post(permissions.isAdmin, personnel.create);

// .all((req, res, next) => {
//   if (/[^A-Za-z]/g.test(req.params.modelRelatedName)) {
//     next(new CustomError("Category name can only contain letters", 400));
//   } else {
//     next();
//   }
// })

module.exports = router;
