// yarn add date-fns
const { format } = require("date-fns");

const {
  logFolderCreate,
  fs,
  fsPromises,
  path,
} = require("../helpers/logFolderCreate");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyy.MM.dd  HH:mm:ss")}`;
  const logItem = `${dateTime} -- ${message}\n`;

  try {
    logFolderCreate();

    // fsPromises.appendFile(path, data[, options])
    await fsPromises.appendFile(
      path.join(__dirname, "..", "..", "logs", logName),
      logItem
    );
    // await fs.createWriteStream(path.join(__dirname, "..", "..", "logs", logName), {
    //   flags: "a+",
    // }).write(logItem);
  } catch (err) {
    console.log(err);
  }
};

// logger'lar response tamamlandiktan hemen sonra calismalidir ki authentication verilerine de erisebilsin ve daha anlamli bir loglama uretebilsin. morgan bunu arkaplanda response finish event emitter'i ile saglar. Response close ve finish adinda 2 event'a sahiptir, finish response gonderildikten sonra calisir, close ise response'un tamamlandigini veya client(baglanti hatasi nedeniyle)/server(olusan bir hata nedeniyle) tarafindan response tamamlanmadan once sonlandirildigi zamanlarda calisir. on('finish') olayını, herhangi bir isteğin başarıyla tamamlanmasının ardından gerçekleştirilmesi gereken loglama ve temizlik(eventemitter close) işlemleri için kullanırsınız. on('close') istemci veya sunucu tarafından bağlantının beklenmedik şekilde kapatılması durumlarında kullanışlıdır. Bu, yanıt gönderimi sırasında meydana gelebilecek kesintileri ele almanız gerektiğinde önem kazanır.
// error handler'lar yalnizca kendilerinden once olusan hatalari yakalayabilir veya next(error) ile kendilerinden once olusmus olan bir hatayi direkt olarak alabilir. Bu nedenle logger gibi basta tanimlanacak(veya nodejs local logger ise authentication'dan sonra da olabilir) middleware'ler error handler gibi calistirilamaz, bunun yerine hata durumlari error handler'da ayrica log'lanabilir.
const logger = (req, res, next) => {
  res.on("finish", () => {
    const origin = req.headers.origin ?? "localhost";
    logEvents(
      `${req.method}\t${origin}\t${req.url}\t${req.user?.email}\t${req.headers.authorization}`,
      // `${req.method}\t${req.url}\t${req.user?.email}\t${req.headers.authorization}`,
      "reqLog.txt"
    );
    console.log(`${req.method} ${req.path}`);
  });
  next();
};

module.exports = { logger, logEvents, fs, fsPromises, path };
