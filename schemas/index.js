const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/spa_mall")  //몽고db를 통해서 연결을 하며, 어떤주소:localhost:27017로 연결을 하며,
    .then(()=>{
      console.log("몽고디비 연결됨") 
    })
    .catch(err => console.log(err)); //spa_mall이라는 db명을 이용해서 연결
};  

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;
// mongodb://127.0.0.1:27017
//mongodb://localhost:27017