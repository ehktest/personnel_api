"use strict";

// yarn add mongoose
const mongoose = require("mongoose");
const CustomError = require("../errors/customError");

// https://mongoosejs.com/docs/connections.html#options
// mongoose.connect(uri, options);
// https://mongoosejs.com/docs/5.x/docs/deprecations.html
// mongodb'nin verdigi warning'lerden kurtulmak icin options parameter object'e useUnifiedTopology ve useNewUrlParser true verilmelidir. NodeJS Driver 4'ten beri useNewUrlParser ve useUnifiedTopology'nin bir etkisi kalmamistir, MongoDB'de Cluster'a Database baglarken girilen connection method'ta MongoDB Driver olarak NodeJS 5.5 secildigi icin burada kullanimina gerek kalmayacaktir ancak NodeJS Driver olarak 4'ten eski bir surum secilirse kullanimi etkili ve gerekli olacaktir.
const CLUSTER = process.env?.DATABASE_URI || "mongodb://localhost:27017/";
const DATABASE = process.env?.DATABASE_NAME || "PersonnelAPI";

// database name, cluster'da mevcut olmasa bile collection'larda oldugu gibi otomatik olusturur.
// mongoose
//   .connect(`${CLUSTER}/${DATABASE}`)
//   .then(() => console.log("*** DB Connected ***"))
//   .catch(() => console.log("*** DB Connection Error ***", err));

const connectDB = async () => {
  try {
    // database name, cluster'da mevcut olmasa bile collection'larda oldugu gibi otomatik olusturur.
    await mongoose.connect(`${CLUSTER}`);
    console.log(`*** DB${DATABASE && " " + DATABASE} Connected ***`);
  } catch (err) {
    console.log(`*** DB${DATABASE && " " + DATABASE} Connection Error ***`);
    console.error(err);
    throw new CustomError(`DB${DATABASE && " " + DATABASE} connection failed`);
  }
};

module.exports = { mongoose, connectDB };
