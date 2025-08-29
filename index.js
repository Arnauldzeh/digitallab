require("dotenv").config();
const app = require("./app");

if (process.env.IS_LOCAL === "true") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}
//n llll
module.exports = app;
