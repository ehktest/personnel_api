"use strict";
const router = require("express").Router();

const token = require("../controllers/tokenController");
// const permissions = require("../middlewares/permissions");
const { isAdmin } = require("../middlewares/permissions");
// const CustomError = require("../errors/customError");
const idValidation = require("../middlewares/idValidation");

// Token:
// router
//   .route("/:tokenId(\\w+)")
//   .all(idValidation)
//   // ? get single
//   .get(permissions.isAdmin, Token.read)
//   // ? update
//   .put(permissions.isAdmin, Token.update)
//   .patch(permissions.isAdmin, Token.update)
//   // ? delete
//   .delete(permissions.isAdmin, Token.destroy);

// router
//   .route("/")
//   // ? get all
//   .get(permissions.isAdmin, Token.list)
//   // ? create
//   .post(permissions.isAdmin, Token.create);

router.use(isAdmin);

// ! swagger route regex'lerle saglikli calismamaktadir. orn: (\\w+). idValidation middleware'i varsa kullanilmayabilir.
router
  .route("/:tokenId")
  .all(idValidation)
  // ? get single
  .get(token.read)
  // ? update
  .put(token.update)
  .patch(token.update)
  // ? delete
  .delete(token.destroy);

router
  .route("/")
  // ? get all
  .get(token.list)
  // ? create
  .post(token.create);

// .all((req, res, next) => {
//   if (/[^A-Za-z]/g.test(req.params.modelRelatedName)) {
//     next(new CustomError("Category name can only contain letters", 400));
//   } else {
//     next();
//   }
// })

module.exports = router;
