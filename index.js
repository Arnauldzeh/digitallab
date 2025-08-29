require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 5000; // Render définit process.env.PORT automatiquement
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

module.exports = app;
