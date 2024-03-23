"use strict";

const Department = require("../models/departmentModel");

module.exports = {
  // ? get all
  list: async (req, res) => {
    /*
      #swagger.tags = ["Departments"]
      #swagger.summary = "List Departments - <Permission: Login>"
      #swagger.description = `
          You can send query with endpoint for filter[], search[], sort[], page and limit.
          <ul> Examples:
              <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
              <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
              <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
              <li>URL/?<b>page=2&limit=1</b></li>
          </ul>
      `
    */
    // const data = await Department.find({});
    //* - FILTERING & SEARCHING & SORTING & PAGINATION *//
    // ! middleware ile response'a eklenen getModelList async function'ina model girilerek filter, search, sort, pagination yaptirilabilir dilenen controller method'unda.
    const data = await res.getModelList(Department);

    // ! pagination detail'leri icin middleware'e eklenmis ekstra async function ile pagination detail'leri response ile donulebilir, bu frontend pagination oldukca elverislidir, ekstra hic bir package/logic kullanmaya gerek kalmaz.
    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(Department),
      result: data,
    });
  },
  // ? get single
  read: async (req, res) => {
    /*
      #swagger.tags = ["Departments"]
      #swagger.summary = "Get Single Department - <Permission: Login>"
    */
    const data = await Department.findById(req.params.departmentId);

    res.status(200).json({
      error: false,
      result: data,
    });
  },
  // ? create
  create: async (req, res) => {
    /*
      #swagger.tags = ["Departments"]
      #swagger.summary = "Create Department - <Permission: Admin>"
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              name: 'Test Department'
          }
      }
    */
    const data = await Department.create(req.body);
    res.status(201).json({
      error: false,
      result: data,
    });
  },
  // ? update
  update: async (req, res) => {
    /*
      #swagger.tags = ["Departments"]
      #swagger.summary = "Update Department - <Permission: Admin>"
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              name: 'Test DepartmentUPDATE'
          }
      }
    */
    // const data = await Department.updateOne(
    //   { _id: req.params.departmentId },
    //   req.body
    // );
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndUpdate()
    const data = await Department.findOneAndUpdate(
      { _id: req.params.departmentId },
      req.body,
      { runValidators: true, new: true }
    ); // default olarak bulunani doner, update edilmis halini degil. new:true ile update edilmis halini doner.

    // 202 -> accecpted
    res.status(202).json({
      error: false,
      message: "Updated",
      body: req.body, // gonderilen veriyi goster
      // info: data,
      // result: await Department.findById(req.params.departmentId), // guncellenmis veriyi goster
      result: data, // guncellenmis veriyi goster
    });
  },
  // ? delete
  destroy: async (req, res) => {
    /*
      #swagger.tags = ["Departments"]
      #swagger.summary = "Delete Department - <Permission: Admin>"
    */
    const data = await Department.deleteOne({
      _id: req.params.departmentId,
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

  personnels: async (req, res) => {
    /*
      #swagger.tags = ["Departments"]
      #swagger.summary = "List Department Personnels - <Permission: Admin | Lead>"
      #swagger.description = `
          You can send query with endpoint for filter[], search[], sort[], page and limit.
          <ul> Examples:
              <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
              <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
              <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
              <li>URL/?<b>page=2&limit=1</b></li>
          </ul>
      `
    */
    const Personnel = require("../models/personnelModel");
    const data = await res.getModelList(
      Personnel,
      {
        departmentId: req.params.departmentId,
      },
      "departmentId"
    );
    res.status(200).send({
      error: false,
      detail: await res.getModelListDetails(Personnel, {
        departmentId: req.params.departmentId,
      }),
      data,
    });
  },
};

// Status Code'lar
// 1xx -> Informational responses
// 2xx -> Successful responses
// 3xx -> Redirection responses
// 4xx -> Client error responses
// 5xx -> Server error responses
