//전역적인 경로나 기능을 다루는 라우터를 직접 생성

//나머지 기능들에 대한 라우터는 routes/index.js를 통해서 가져오기
//1. 사용자 인증
//2. 에러처리
//3. 정적파일 라우터
//4. API버전 라우터

//5. pw 해쉬화 진행하기 (써보는데 의의)
const express = require('express');
const app = express();
const port = 3000;
const indexRouter = require("./routes/index.js")

const connect = require('./schemas')
connect();

app.use(express.json())
app.use("/",indexRouter);


app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });