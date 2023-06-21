const mongoose = require("mongoose");

const postsSchema = {
  posts: {
    nickname: {
      type: String,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
};

module.exports = mongoose.model("Posts", postsSchema);
