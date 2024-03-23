"use strict";

// yarn add mongoose
const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;

const departmentSchema = new Schema(
  {
    // _id
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    collection: "department",
    timestamps: true,
  }
);

// https://mongoosejs.com/docs/models.html
// Modeller, Schema tanımlarından derlenen constructor'lardir.  Bir modelin instance'ina document denir.  Modeller, MongoDB veritabanındaki document'leri oluşturmaktan ve okumaktan sorumludur.
// mongoose.model('modelName',fromWhichSchema)
module.exports = models?.Department || model("Department", departmentSchema);
