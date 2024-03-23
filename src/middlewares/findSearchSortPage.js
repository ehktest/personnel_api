"use strict";

module.exports = (req, res, next) => {
  console.log("🔭 ~ list: ~ req.query ➡ ➡ ", req.query);

  // * Alternatif(Tek tek req.query'den cekme)
  // const filter = req.query?.filter || {};

  // const search = req.query?.search || {};

  // for (let key in search) {
  //   search[key] = { $regex: search[key], $options: "i" };
  // }

  // const sort = req.query?.sort || {};

  // let limit = Number(req.query?.limit);

  // limit = limit > 0 ? limit : process.env?.PAGE_SIZE;

  // let page = Number(req.query?.page);

  // page = page > 0 ? page - 1 : 0;

  // let skip = Number(req.query?.skip);

  // skip = skip > 0 ? skip : page * limit;

  // * Req.query'den deconstruction
  const {
    filter = {},
    search: rawSearch = {},
    sort = {},
    limit: rawLimit = process.env?.PAGE_SIZE,
    page: rawPage = 1,
    skip: rawSkip = 0,
  } = req.query;

  const search = Object.entries(rawSearch).reduce((acc, [key, value]) => {
    if (!isNaN(value) && value.trim() !== "") {
      // Eğer değer sayısal bir değerse ve boş bir string değilse
      acc[key] = { $regex: value }; // Flag olmadan regex kullan
    } else {
      // Değer metinsel bir ifadeyse
      acc[key] = { $regex: value, $options: "i" }; // i flag'li regex kullan
    }
    return acc;
  }, {});

  let limit = Number(rawLimit);
  limit = limit > 0 ? limit : process.env?.PAGE_SIZE;

  let page = Number(rawPage);
  page = page > 0 ? page - 1 : 0;

  let skip = Number(rawSkip);
  skip = skip > 0 ? skip : page * limit;

  // ! Foreign key'in yalnizca id'sini gormektense document'in kendisini nested olarak gormek icin populate(foreignKeyFieldName) methodu kullanilabilir. Populate hangi model'den ObjectId ile document dondurecegini field'taki ref key'ine girilmis olan model ismi ile belirleyecektir.
  // https://mongoosejs.com/docs/api/query.html#Query.prototype.populate()
  res.getModelList = async function (Model, condition = {}, populate = null) {
    // return await (Object.keys(condition).length > 0
    //   ? Model.find(condition)
    //   : Model
    // )
    return await Model.find({ ...filter, ...search, ...condition })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };

  // Details:
  // ! pagination detail'leri ayri bir async function ile response'ta donulebilir, bu frontend pagination icin oldukca elverislidir, ekstra hic bir package/logic kullanmaya gerek kalmaz.
  res.getModelListDetails = async (Model, condition = {}) => {
    const data = await Model.find({
      ...filter,
      ...search,
      ...condition,
    });

    let details = {
      filter,
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2,
        total: Math.ceil(data.length / limit),
      },
      totalRecords: data.length,
    };
    // pages.next pages.total'dan buyuk oldugu anda false yap
    details.pages.next =
      details.pages.next > details.pages.total ? false : details.pages.next;
    // donen document sayisi pagination item sayisindan kucukse pagination deaktif
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};
