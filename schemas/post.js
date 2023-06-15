const mongoose = require("mongoose");

const postsSchema ={
    user : {
        type: String,
        required:true,
    },
    password : {
        type: String,
        required:true
    },
    title : {
        type: String,
        required: true
    },
    content:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }


}

module.exports = mongoose.model("Posts", postsSchema);