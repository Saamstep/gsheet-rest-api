const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { JSONFromURL } = require("googlesheetstojson");
const PORT = process.env.PORT || 8080;

require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());

// app.all();

let myLogger = function (req, res, next) {
  if (req.query.key == process.env.HASH) {
    next();
  } else {
    res.status(401).send("Authentication Error");
  }
};

app.use(myLogger);

app.get("/get/:key", async (req, res) => {
  const data = await JSONFromURL(process.env.GOOGLE_SHEET_URL);

  let value = null;

  data.forEach((i) => {
    if (i.key == req.params.key) value = i.value;
  });

  res.status(200).send(value || "null");
});

app.listen(PORT, () => {
  console.log(`Alive on port ${PORT}`);
});
