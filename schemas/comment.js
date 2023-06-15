const mongoose = require("mongoose");

const commentsSchema ={
    user : {
        type: String,
    },
    password : {
        type: String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    commentId:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    postId:{
        type:String,
        required:true
    }

}

module.exports = mongoose.model("Comments", commentsSchema);