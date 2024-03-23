"use strict";

const CustomError = require("../errors/customError");

// Permissions -> authorization

module.exports = {
  isLogin: (req, res, next) => {
    if (req?.user && req?.user.isActive) {
      next();
    } else {
      throw new CustomError("You must be authenticated first", 403);
    }
  },

  isAdmin: (req, res, next) => {
    if (req?.user && req?.user.isActive && req?.user.isAdmin) {
      next();
    } else {
      throw new CustomError(
        "You must be authenticated and have admin permissions",
        403
      );
    }
  },

  isAdminOrLead: (req, res, next) => {
    const departmentId = req.params?.departmentId;
    if (
      req?.user &&
      req.user.isActive &&
      (req.user.isAdmin ||
        (req.user.isLead && String(req.user.departmentId) === departmentId))
    ) {
      next();
    } else {
      throw new CustomError(
        "You must be authenticated and have admin or department lead permissions"
      );
    }
  },

  isAdminOrOwn: (req, res, next) => {
    const personnelId = req.params?.personnelId;
    if (
      req?.user &&
      req.user.isActive &&
      (req.user.isAdmin || String(req.user._id) === personnelId)
    ) {
      next();
    } else {
      throw new CustomError(
        "You must be authenticated and have admin permissions or must be that personnel",
        403
      );
    }
  },

  // toString() -> null veya undefined ise hata firlatir -> undefined.toString() -> TypeError: Cannot read properties of undefined (reading 'toString')
  // String(primitive) ->  primitive'leri daima donusturur, object'leri ise [object Object] olarak donusturur. String(undefined) -> "undefined"
  // Hehangi bir departmandaki lead, o departmandaki personnel'leri goruntuleyebilsin, admin ise de ulasabilir, personnel kendi kaydina ulasabilir
  isLeadAdminOrOwn: async (req, res, next) => {
    const Personnel = require("../models/personnelModel");
    const userId = req.user?._id;
    const departmentId = req.user?.departmentId.toString();
    const searchedPersonnel = await Personnel.findById(req.params.personnelId);
    const isDepartmentLead =
      req.user?.isLead &&
      departmentId == searchedPersonnel?.departmentId.toString();
    const isOwn = userId == req.params.personnelId;
    if (
      req.user &&
      req.user?.isActive &&
      (req.user?.isAdmin || isDepartmentLead || isOwn)
    ) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error(
        "You must be authenticated and either must have admin permissions, must have department lead permissions, or must be that personnel."
      );
    }
  },
};
