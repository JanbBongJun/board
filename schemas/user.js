const mongoose = require("mongoose")
//sql이 아닌 odm으로 유연성에 한계가 있어보임
//예를들어 sql에서는 데이터를 테이블별로 묶을 수 있기 때문에
//1:1, 1:N, M:N관계를 설정할 수 있지만,
//mongoDB는 불가능하기 때문에 하나의 큰 틀로 묶어야하며,
//db에서 데이터를 2번불러와야하는 경우도 있음.
const userSchema ={
    nickname:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
}
module.exports = mongoose.model("User",userSchema)