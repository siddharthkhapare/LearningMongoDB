const express = require("express");
const app = express();
const dotenv = require("dotenv");
const {router} = require("./routes/blogs.route");
const { connectToDB } = require("./config/db");
dotenv.config();

app.use(express.json());

connectToDB();


app.use("/api", router);
app.use("/api/auth", require("./routes/auth.routes"));

app.listen(process.env.PORT, () => {
  console.log("App is listening on port ", process.env.PORT);
});

