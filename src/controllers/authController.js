"use strict";

const Personnel = require("../models/personnelModel");
const Token = require("../models/tokenModel");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  login: async (req, res) => {
    // ? swagger eklemeleri yapmak icin yorum icinde(multi-line singleline farketmez) #swagger. ile baslayan satirlar eklenerek yeni custom field'lar eklenebilir.
    // https://swagger-autogen.github.io/docs/endpoints/tags
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Login - <Permission: Public>"
      #swagger.description = "Login with username and password"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          email: 'testf0@site.com',
          password:'Qwer1234!'
        }
      }
    */
    // #swagger
    // * model field'larinin set method'u find query'leri ile de calisir, hatta query'de de calistigi icin sifrelenmis hali girildiginde hata alinir cunku zaten setter ile tekrar sifrelenir.
    // yani asagidaki algoritma yerine direkt olarak:
    // const user = await Personnel.findOne({email,password}) ile de logic kurulabilir.
    // const user = await Personnel.findOne({email,password:passwordEncrypt(password)}) ile calismayacaktir cunku password find query'de zaten sifrelenecektir, iki kere sifrelenmis halini db'deki password value'su ile eslestirir bu da daima false donecektir.
    // ancak mevcut Personnel modelinde, Mongoose'da setter validate'ten once calistigi icin her ikisi de olacaksa tum logic setter'da toplanmasi gerekmesine ragmen setter'da firlatilan error'lar express instance'i tarafindan yakalanamadigi icin icin de pre save kullanilmistir, yani setter kullanilmadigindan uzun yoldan gidilmek zorundadir.
    const { email, password } = req.body;
    if (email && password) {
      // const user = await Personnel.findOne({ email, password, isActive: true });
      // if (user) {
      const user = await Personnel.findOne({ email, isActive: true }).populate(
        "departmentId"
      );
      if (user && user.password === passwordEncrypt(password)) {
        /* SESSION */
        // console.log("🔭 ~ login: ~ req.session ➡ ➡ ", req.session);
        // req.session.id = user._id;
        // req.session.password = user.password;
        // console.log("🔭 ~ login: ~ req.session ➡ ➡ ", req.session);

        // if (user.email === "admin@aa.com") {
        //   req.session.isAdmin = true;
        // } else {
        //   req.session.isAdmin = false;
        // }
        /* SESSION */

        /* TOKEN */
        // token daha once olusturulmus mu?
        let tokenData = await Token.findOne({ userId: user._id });

        // token yoksa olustur
        if (!tokenData) {
          // benzersiz bir token olustur
          const tokenKey = passwordEncrypt(user._id + Date.now()); // passwordEncyrpt(uniqueToken) -> sabit uzunlukta(bu ornek icin 64 karakterde) unique Token uretir, Date.now() basamak sayisi degiskenlik gosterebildigi icin.
          console.log("🔭 ~ login: ~ tokenKey ➡ ➡ ", tokenKey);
          tokenData = await Token.create({ userId: user._id, token: tokenKey });
        }
        /* TOKEN */

        res.status(200).json({
          token: tokenData.token,
          error: false,
          message: "Login OK",
          user,
        });
      } else {
        res.errorStatusCode = 401;
        throw new Error("Login parameters are not true.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Email and password required.");
    }
  },

  logout: async (req, res) => {
    /*
      #swagger.tags = ['Authentication']
      #swagger.summary = 'Logout - <Permission: Public>'
      #swagger.description = 'Delete Token'
    */
    /* SESSION */
    // req.session = null;
    /* SESSION */
    /* TOKEN */
    // 1. Yöntem (Kısa yöntem - Bir kullanici tek bir token alabiliyorsa veya tum cihazlardan cikis yap):
    // console.log("🔭 ~ logout: ~ req.user ➡ ➡ ", req.user);
    // const deleted = await Token.deleteOne({ userId: req.user._id })

    // 2. Yöntem(Bir kullanici birden fazla token alabiliyorsa - Netflix cihaz sayisi/Coklu cihaz):
    const auth = req.headers?.authorization || null; // Token tokenKey
    const tokenKey = auth ? auth.split(" ") : null; // ['Token', 'tokenKey']

    let deleted;
    if (tokenKey && tokenKey[0] == "Token") {
      deleted = await Token.deleteOne({ token: tokenKey[1] });
    }
    /* TOKEN */
    res.status(200).json({
      error: false,
      message: "Logout OK",
      deleted,
    });
  },
};
