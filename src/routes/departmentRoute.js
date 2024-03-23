"use strict";
const router = require("express").Router();

const department = require("../controllers/departmentController");
const permissions = require("../middlewares/permissions");
// const CustomError = require("../errors/customError");
const idValidation = require("../middlewares/idValidation");

// Department:
// ! swagger route regex'lerle saglikli calismamaktadir. orn: (\\w+). idValidation middleware'i varsa kullanilmayabilir.
router
  .route("/:departmentId/personnels")
  .all(idValidation)
  // ? get all
  .get(permissions.isAdminOrLead, department.personnels);

router
  .route("/:departmentId")
  .all(idValidation)
  // ? get single
  .get(permissions.isLogin, department.read)
  // ? update
  .put(permissions.isAdmin, department.update)
  .patch(permissions.isAdmin, department.update)
  // ? delete
  .delete(permissions.isAdmin, department.destroy);

router
  .route("/")
  // ? get all
  .get(permissions.isLogin, department.list)
  // ? create
  .post(permissions.isAdmin, department.create);

// .all((req, res, next) => {
//   if (/[^A-Za-z]/g.test(req.params.modelRelatedName)) {
//     next(new CustomError("Category name can only contain letters", 400));
//   } else {
//     next();
//   }
// })

module.exports = router;
