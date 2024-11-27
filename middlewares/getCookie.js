require("dotenv").config();

var getCookie = (req, res) => {
  let cookies;
  let response = {};
  try {
    cookies = req.get("Cookie");
    if (cookies == undefined) throw new Error("No Cookies!");
    cookies = cookies.split("; ");

    cookies.forEach((element) => {
      element = element.split("=");
      response[element[0]] = element[1];
    });
    return response;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

module.exports = getCookie;
