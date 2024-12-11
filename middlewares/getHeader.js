require("dotenv").config();

/**
 * Header format;
 *
 * Name   "key":"value"; "key2":"value2"
 *
 */
var getHeader = (req, res, headerName = "Cookie") => {
  let headers;
  let response = {};
  try {
    headers = req.get(headerName);
    if (headers == undefined) throw new Error("No Header with this name");
    headers = headers.split("; ");

    headers.forEach((element) => {
      element = element.split("=");
      response[element[0]] = element[1];
    });
    return response;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

module.exports = getHeader;
