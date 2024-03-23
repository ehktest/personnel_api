"use strict";

const Token = require("../models/tokenModel");

module.exports = {
  // ? get all
  list: async (req, res) => {
    // ! _swagger.tagName = true -> atamayi gormezden gelir
    /*
      _swagger.deprecated = true
      #swagger.ignore = true
    */
    // const data = await Token.find({});
    //* - FILTERING & SEARCHING & SORTING & PAGINATION *//
    // ! middleware ile response'a eklenen getModelList async function'ina model girilerek filter, search, sort, pagination yaptirilabilir dilenen controller method'unda.
    const data = await res.getModelList(Token);

    // ! pagination detail'leri icin middleware'e eklenmis ekstra async function ile pagination detail'leri response ile donulebilir, bu frontend pagination oldukca elverislidir, ekstra hic bir package/logic kullanmaya gerek kalmaz.
    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(Token),
      result: data,
    });
  },
  // ? get single
  read: async (req, res) => {
    /*
      _swagger.deprecated = true
      #swagger.ignore = true
    */
    const data = await Token.findById(req.params.tokenId);

    res.status(200).json({
      error: false,
      result: data,
    });
  },
  // ? create
  create: async (req, res) => {
    /*
      _swagger.deprecated = true
      #swagger.ignore = true
    */
    const data = await Token.create(req.body);
    res.status(201).json({
      error: false,
      result: data,
    });
  },
  // ? update
  update: async (req, res) => {
    /*
      _swagger.deprecated = true
      #swagger.ignore = true
    */
    // const data = await Token.updateOne(
    //   { _id: req.params.tokenId },
    //   req.body
    // );
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndUpdate()
    const data = await Token.findOneAndUpdate(
      { _id: req.params.tokenId },
      req.body,
      { runValidators: true, new: true }
    ); // default olarak bulunani doner, update edilmis halini degil. new:true ile update edilmis halini doner.

    // 202 -> accecpted
    res.status(202).json({
      error: false,
      message: "Updated",
      body: req.body, // gonderilen veriyi goster
      // info: data,
      // result: await Token.findById(req.params.tokenId), // guncellenmis veriyi goster
      result: data, // guncellenmis veriyi goster
    });
  },
  // ? delete
  destroy: async (req, res) => {
    /*
      _swagger.deprecated = true
      #swagger.ignore = true
    */
    const data = await Token.deleteOne({
      _id: req.params.tokenId,
    });

    // res.sendStatus(data.deletedCount ? 204 : 404);
    // 204 ile response body yollamaz, o yüzden status 200 yollayip neyin silindigi de kullaniciya gösterilebilir.
    // if (data.deletedCount !== 0) {
    //   // res.sendStatus(204);
    //   res.status(200).json({
    //     error: false,
    //     result: data,
    //   });
    // } else {
    //   res.errorStatusCode = 404;
    //   throw new Error("Document Not Found");
    // }
    if (!data.deletedCount) throw new CustomError("Not deleted", 409); // 409 Conflict
    // res.status(200).json({
    res.status(204).json({
      error: false,
      result: data,
    });
  },
};

// Status Code'lar
// 1xx -> Informational responses
// 2xx -> Successful responses
// 3xx -> Redirection responses
// 4xx -> Client error responses
// 5xx -> Server error responses
