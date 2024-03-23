"use strict";

// https://stackoverflow.com/questions/69165892/how-to-throw-an-exception-with-a-status-code#76175527
// Message Error class'inin default attribute'udur, statusCode custom olarak eklenmektedir.
class CustomError extends Error {
  name = "customError";
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = CustomError;
