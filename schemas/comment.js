const mongoose = require("mongoose");

const commentsSchema ={
    nickname : {
        type: String,
        ref:'User'
    },

    comment:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    },

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    }

}

module.exports = mongoose.model("Comments", commentsSchema);