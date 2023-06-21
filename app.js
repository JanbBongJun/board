
const express = require('express');
const app = express();
const port = 3000;
const indexRouter = require("./routes/index.js")
const connect = require('./schemas');
const cookieParser = require('cookie-parser');
connect();

app.use([express.json(), cookieParser()])
app.use("/",indexRouter);


app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });