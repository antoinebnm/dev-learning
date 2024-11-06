var fetchData = async (
  req,
  url = "/",
  body = {},
  method = "POST",
  headers = { "Content-Type": "application/json" }
) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host") + url;
    const response = await fetch(`${fullUrl}`, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("No JSON tranmitted!");
    }
    const json = await response.json();

    return json;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

module.exports = fetchData;
