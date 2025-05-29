require("dotenv").config();

const http = require("http");
const app = require("./app");
const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at port ${port}...`);
});
