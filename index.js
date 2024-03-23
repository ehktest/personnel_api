"use strict";

// yarn add express dotenv
require("dotenv").config();
// yarn add express-async-errors
require("express-async-errors");
const express = require("express");
const app = express();
const { logger } = require("./src/middlewares/fsLogging");
const { connectDB } = require("./src/configs/dbConnection");
const syncModels = require("./src/helpers/sync");
const session = require("cookie-session");
const swaggerUi = require("swagger-ui-express");
const redoc = require("redoc-express");
const cors = require("cors");
const HOST = process.env?.HOST || "cloud.mongodb.com";
const PORT = process.env?.PORT || 8000;

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */

// * swagger'da tanitilan host ile tarayici'dan atilan istek url'si eslesmezse same-origin olarak algilamayip cross-origin gibi algilayacagindan cors'a takilir, bu nedenle swagger host'ta 127.0.0.1 olarak belirtildiyse tarayicidan da 127.0.0.1 uzerinden istek atilmalidir, localhost uzerinden atilirsa cors hatasi alinacaktir.
// cors
// app.use(cors({ origin: "*" }));

// nodejs local logger
// app.use(logger);

// ? morgan local logger
app.use(require("./src/middlewares/morganLogging"));

// ? SWAGGER JSON
// https://expressjs.com/en/5x/api.html#res.sendFile
// options parameter object -> root	Root directory for relative filenames.
// app.get("/documents/json", (req, res) => {
//   res.sendFile("./swagger.json", { root: "." });
// });

// ! express.static ile bir dosya basilacagi zaman use'dan baska bir method kullanilamaz cunku express.static'e girilen arguman route'un sonuna eklenerek calisacagi icin karisiklik olusturabilecegi dusunulebilir. app.get ile yapildiginda swagger dilendigi sekilde yalnizca get method’u ile ulasilabilir hale gelecektir ancak swagger documentation’inda documents/json(app.get route) adinda bir controller belirecektir, bu nedenle express.static ile yapmak en saglikli cozumdur.
app.use("/documents/json", express.static("./swagger.json"));

// ? SWAGGER
app.use(
  "/documents/swagger",
  swaggerUi.serve,
  swaggerUi.setup(require("./swagger.json"), {
    swaggerOptions: { persistAuthorization: true },
  })
);

// ? REDOC
app.use(
  "/documents/redoc",
  redoc({
    title: "PersonnelAPI",
    specUrl: "/documents/json",
  })
);

// Accept data, convert it to object(text excluded), assign object to req.body
// DATA RECEIVING -> body parsers(eskiden expressjs'te ilave body parser package'i ile bu islem yapiliyordu ama artik body verileri bu sekilde direkt express instance uzerinden cekilebilmektedir)
// https://expressjs.com/en/resources/middleware/body-parser.html
// ( npm install body-parser / var bodyParser = require('body-parser') / app.use(bodyParser.json())) / var jsonParser = bodyParser.json() app.post('/api/users', jsonParser, function (req, res) {…} )
// Accept JSON and convert to object
app.use(express.json());
// Accept text
app.use(express.text());
// Accept form
app.use(express.urlencoded({ extended: true }));

// (browser)http://localhost:8000/public/images/monalisa.jpg -> Cannot GET /public/images/monalisa.jpg
// ? Allow static files
// app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/static", express.static("./public"));
// path /static/* iken ./public/* ile eslestirilir.
// http://localhost:8000/static/images/monalisa.jpg -> gorsel painted

// IIFE
(async () => {
  // Veritabanı bağlantısını test et
  // require("./src/controllers/dbConnection");
  await connectDB();

  // sync models(model degisikliklerinin database'de manuel olarak handle edilmesi)
  await syncModels();

  // ? Authentication(Session Cookies - Persistent Cookies):
  // http://expressjs.com/en/resources/middleware/cookie-session.html
  // https://expressjs.com/en/5x/api.html#res.cookie -> alternatif
  // https://www.npmjs.com/package/cookie-session
  //* yarn add cookie-session
  // cookieSession(options)
  // options.secret -> A string which will be used as single key if keys is not provided.
  // options.maxAge -> a number representing the milliseconds from Date.now() for expiry. 3 gun icin 1000(sn) * 60(dk) * 60(s) * 24(g) * 3
  app.use(
    session({
      secret: process.env.SECRET_KEY, // Sifreleme anahtari
      // maxAge: 1000 * 60 * 60 * 24 * 3 // milliseconds // 3 days
      // Burasi global cookie ayarlaridir, maxAge burada tanimlanirsa session olarak calismaz ve degiskenlik gostermez. controller'larda ayri ayri yapmak daha fazla esneklik saglar.
    })
  );

  // ? Authentication(Classic Token):
  app.use(require("./src/middlewares/authentication"));

  // Filter, Search, Sort, Pagination middleware
  app.use(require("./src/middlewares/findSearchSortPage"));

  // routes
  app.use("/", require("./src/routes"));
  // index.js dosyalari path'te belirtilmese de otomatik olarak calisir.

  // not found catcher
  app.all("*", (req, res) => {
    res.status(404).send(`${req.method} ${req.path} not found`);
  });

  // error handler middleware via imported controller
  app.use(require("./src/middlewares/errorHandler"));

  // request listener
  app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}`);
  });
})();
