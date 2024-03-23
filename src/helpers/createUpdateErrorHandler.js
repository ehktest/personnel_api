const CustomError = require("../errors/customError");

module.exports = (error, next) => {
  if (error.name === "MongoServerError" && error.code === 11000) {
    // Duplicate key(unique constraint error handling)

    // console.log(error); // index: 0, code: 11000, keyPattern: { email: 1 }, keyValue: { email: 'email@site.com' },
    next(
      new CustomError(
        `Duplicate key error. A personnel with this ${
          Object.keys(error.keyPattern)[0]
        }(${Object.values(error.keyValue)[0]}) may already exist.`,
        400
      )
    );
  } else if (error.name === "ValidationError") {
    console.log("🔭 ~ Validation error ➡ ➡ ", error);
    console.log("🔭 ~ Validation Object.keys(error) ➡ ➡ ", Object.keys(error));
    const messages = Object.values(error.errors).map((err) => err.message);

    next(new CustomError(messages.join(", "), 400));
  } else if (error instanceof CustomError) {
    next(error);
  } else {
    next(new CustomError(`${error.name}`, 500));
  }
};
