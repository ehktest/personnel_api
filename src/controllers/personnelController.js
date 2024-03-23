"use strict";

const Personnel = require("../models/personnelModel");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const createUpdateErrorHandler = require("../helpers/createUpdateErrorHandler");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Personnels"]
      #swagger.summary = "List Personnels - <Permission: Admin>"
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
    const data = await res.getModelList(Personnel, {}, "departmentId");

    res.status(200).json({
      error: false,
      details: await res.getModelListDetails(Personnel, {}, "departmentId"),
      result: data,
    });
  },

  read: async (req, res) => {
    /*
      #swagger.tags = ["Personnels"]
      #swagger.summary = "Get Single Personnel - <Permission: Admin | Lead | Own>"
    */
    const data = await Personnel.findById(req.params.personnelId).populate(
      "departmentId"
    );

    res.status(200).json({
      error: false,
      result: data,
    });
  },

  create: async (req, res, next) => {
    /*
      #swagger.tags = ['Personnels']
      #swagger.summary = 'Create Personnel - <Permission: Admin>'
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          email: 'testdept0@site.com',
          password:  'Qwer1234!',
          username: 'username',
          firstName: 'John',
          lastName: 'Doe',
          phone: '123456789',
          title: 'jobTitle',
          salary: 2500,
          description: "description",
          isActive: true,
          isAdmin: false,
          isLead: false,
        },
      }
    */

    try {
      // * eger bir personnel isLead true create'lenmisse, ayni department'taki diger personel'lerde isLead false yapma
      const isLead = req.body?.isLead || false;
      if (isLead) {
        await Personnel.updateMany(
          { departmentId: req.body.departmentId, isLead: true },
          { isLead: false }
        );
      }
      const data = await Personnel.create(req.body);

      res.status(201).json({
        error: false,
        result: data,
      });
      // pre save hatalarini yakala ve error handler middleware'e aktar
    } catch (error) {
      createUpdateErrorHandler(error, next);
    }
  },

  update: async (req, res, next) => {
    /*
      #swagger.tags = ['Personnels']
      #swagger.summary = 'Update Personnel - <Permission: Admin | Own>'
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          email: 'newtestdept0@site.com',
          password:  'Qwer4321!',
          username: 'newusername',
          firstName: 'newJohn',
          lastName: 'newDoe',
          phone: '987654321',
          title: 'newJobTitle',
          salary: 3500,
          description: "newdescription",
          isActive: true,
          isAdmin: false,
          isLead: false,
        },
      }
    */

    try {
      // * admin degilse kendi kaydinda belirli alanlari degistiremez
      if (!req.user?.isAdmin) {
        delete req.body?.isAdmin;
        delete req.body?.isLead;
        delete req.body?.isActive;
        delete req.body?.salary;
        delete req.body?.departmentId;
      }

      console.log("🔭 ~ update: ~ req.body ➡ ➡ ", req.body);

      // * eger bir personnel isLead true update'lenmisse, ayni department'taki diger personel'lerde isLead false yapma
      const isLead = req.body?.isLead || false;
      if (isLead) {
        // https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/#specify-the-fields-to-return
        // The following operation finds a document in the bios collection and returns only the name, contribs and _id fields:
        // db.bios.findOne( { }, { name: 1, contribs: 1 } )
        const { departmentId } = await Personnel.findOne(
          { _id: req.params.personnelId },
          { departmentId: 1 }
        );
        await Personnel.updateMany(
          { departmentId, isLead: true },
          { isLead: false }
        );
      }

      // delete ile silinebilecekler:
      // Objeden bir özellik (property). Property yoksa true doner
      // Array'den bir eleman (Bu durumda eleman undefined olarak işaretlenir, dizinin boyutu değişmez).

      console.log("🔭 ~ update: ~ req.params ➡ ➡ ", req.params);
      const data = await Personnel.findOneAndUpdate(
        { _id: req.params.personnelId },
        req.body,
        { runValidators: true, new: true }
      ).populate("departmentId");

      console.log("🔭 ~ update: ~ data ➡ ➡ ", data);

      res.status(202).json({
        error: false,
        message: "Updated",
        body: req.body,

        result: data,
      });
      // pre findOneAndUpdate hatalarini yakala ve error handler middleware'e aktar
    } catch (error) {
      createUpdateErrorHandler(error, next);
    }
  },

  destroy: async (req, res) => {
    /*
      #swagger.tags = ["Personnels"]
      #swagger.summary = "Delete Personnel - <Permission: Admin>"
    */
    const data = await Personnel.deleteOne({ _id: req.params.personnelId });

    if (!data.deletedCount) throw new CustomError("Not deleted", 409);

    res.status(204).json({
      error: false,
      result: data,
    });
  },
};
