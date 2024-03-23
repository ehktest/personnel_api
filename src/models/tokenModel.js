"use strict";

const { mongoose } = require("../configs/dbConnection");
const { Schema, model, models } = mongoose;

const tokenSchema = new Schema(
  // https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/
  //bookstore> db.books.find({rating:9}).explain('executionStats') … executionStats: { … nReturned: 2, … totalDocsExamined: 6, …
  // bookstore> db.books.createIndex({rating:9}) /
  // db.books.getIndexes() -> [ { v: 2, key: { _id: 1 }, name: '_id_' }, // MongoDB tarafindan otomatik olusturulur. { v: 2, key: { rating: 9 }, name: 'rating_9' } ]
  // bookstore> db.books.find({rating:9}).explain('executionStats') // executionStats: { … nReturned: 2, … totalDocsExamined: 2, …
  // bookstore> db.books.dropIndex({rating:9}) -> { nIndexesWas: 2, ok: 1 }
  // Goruldugu gibi normalde bu query ile 5 document uzerinde sorgu yapmasi gerekirken 2 document uzerinde sorgu yaparak sonuc dondurmustur.
  // Index’lere her zaman ihtiyac duyulmaz. Index olusturulan bir field-value oldugunda ve collection’da bu field-value’dan etkilenen bir degisiklik yapildiginda index’in de update edilmesi gerekir(bu arkaplanda otomatik gerceklesir ancak index sayisi cok fazla oldugunda performans avantaji elde etmek yerine handikapi olusturulabilir, bahsedilen budur). Yalnizca belirli sabit degerler tasiyan document’lar veya cok fazla document iceren collection’lar var ise bu durumlarda index olusturmak mantiklidir.
  // MongoDB'de, index'lenmiş bir alan güncellendiğinde, ilgili index (veya birden fazla index varsa index'ler) otomatik olarak güncellenir. Bu işlem, tüm index'i yeniden oluşturmak ("reindex") anlamına gelmez. İlgili index'teki değişiklik, esasen eski girdinin silinip yeni bir girdinin eklenmesi şeklinde gerçekleşir.
  // https://stackoverflow.com/questions/23461152/does-mongodb-reindex-if-you-change-the-field-that-it-is-used-in-index#23461280

  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Personnel",
      required: true,
      index: true,
    },
    token: {
      type: String,
      trim: true,
      required: true,
      index: true,
      unique: true,
    },
  },
  { collection: "token", timestamsp: true }
);

module.exports = models.Token || model("Token", tokenSchema);
