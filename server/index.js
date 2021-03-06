const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
var requestIp = require("request-ip");

const cors = require("cors");
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
  const decryptedStr = key.decrypt(req.body.payload, "utf8");
  const decryptedObj = decryptedStr.split(",");
  res.json(decryptedObj);
});

app.get("/getIp", (req, res) => {
  var clientIp = requestIp.getClientIp(req);
  res.send(clientIp);
});

app.get("/*", (req, res) => res.render(path.join(__dirname, "./index.html")));

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert/privatekey.key")),
    cert: fs.readFileSync(path.join(__dirname, "cert/ssl_certificate.crt")),
  },
  app
);

sslServer.listen(443, () => console.log(`Server started on port 80`));
