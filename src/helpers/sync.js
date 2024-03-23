"use strict";

// const User = require("./models/userModel");
// const { RelatedModel, Model } = require("./models/productModel");

// Django migrate eslenigi, modeldeki degisikliklerin veritabaninina uygulanmasi icin custom bir handler yazilmalidir.

const syncModels = async () => {
  // /* REMOVE DATABASE */
  // const { mongoose } = require("../configs/dbConnection");
  // await mongoose.connection.dropDatabase();
  // console.log("- Database and all data DELETED!");
  // /* REMOVE DATABASE */

  // /* Department & Personnel */
  // const Department = require("../models/departmentModel");
  // const Personnel = require("../models/personnelModel");
  // const departments = [
  //   "FullStack Department",
  //   "DevOps Department",
  //   "CyberSec Department",
  // ];
  // departments.forEach((value) => {
  //   const lowerValue = value.toLowerCase();
  //   // Department.create:
  //   Department.create({ name: value }).then((department) => {
  //     console.log("- Department Added.");
  //     // Personnel.create:
  //     for (let i in [...Array(10)]) {
  //       Personnel.create({
  //         departmentId: department._id,
  //         username: "test" + (lowerValue + i),
  //         password: "Qwer1234!",
  //         firstName: "firstName",
  //         lastName: "lastName",
  //         phone: "123456789",
  //         email: "test" + (lowerValue[0] + i) + "@site.com",
  //         title: "title",
  //         salary: 2500,
  //         description: "description",
  //         isActive: true,
  //         isAdmin: false,
  //         isLead: false,
  //         startedAt: "2023-10-15 13:14:15",
  //       });
  //     }
  //     console.log("- Personnels Added.");
  //   });
  // });
  // /* Department & Personnel */

  // End:
  console.log("** Synchronized **");
};

module.exports = syncModels;
