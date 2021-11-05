const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 512 });

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "./build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/encrypt", (req, res) => {
  const encrypted = key.encrypt(req.body.payload, "base64");
  res.send(encrypted);
});

app.post("/decrypt", (req, res) => {
  const decrypted = key.decrypt(req.body.payload, "utf8");
  res.send(decrypted);
});

app.get("/*", (req, res) => res.render(path.join(__dirname, "./index.html")));

app.listen(80, () => console.log(`Server started on port 80`));
