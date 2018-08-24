const { join } = require("path");
module.exports = {
  entry: join(__dirname, "src/", process.env.TIME || "now"),
};
