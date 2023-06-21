const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");
const auth_middleware = require("../middleware/auth_middleware");

router.post("/posts/:postId/comments", auth_middleware, async (req, res) => {
  const { postId } = req.params;
  const { nickname } = res.locals.user;
  const { comment } = req.body;

  if (!user || !comment || !postId) {
    return res.status(404).json({ msg: "데이터 형식이 올바르지 않습니다" });
  }
  const post = await Posts.findById(new mongoose.Types.ObjectId(postId));
  if (!post) {
    return res.status(401).json({ message: "게시글을 찾지 못했습니다." });
  }
  try {
    await Comments.create({ nickname, comment, postId });
    res.status(200).json({ success: true, msg: "댓글을 생성하였습니다." });
  } catch (err) {
    res.status(400).json({ msg: "예기치 못한 오류 발생" });
  }
});

router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const commentPageNum = req.query.commentPageNum
    ? req.query.commentPageNum
    : 1;
  const commentSize = req.query.commentSize ? req.query.commentSize : 10;
  if (!postId || !commentPageNum || !commentSize) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
  }
  try {
    const comments = await Comments.find({ postId }).select("-postId");
    if (comments.length === 0) {
      res.status(404).json({ msg: "저장된 댓글이 존재하지 않습니다." });
    }
    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (err) {
    res.status(500).json({ msg: "예기치 못한 오류 발생" });
  }
});
router.put(
  "/posts/:postId/comments/:commentId",
  auth_middleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    const { nickname } = res.locals.user;
    if (!postId || !commentId) {
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
    } else if (!nickname || !comment) {
      return res
        .status(400)
        .json({ msg: "닉네임 또는 댓글 내용이 존재하지 않습니다" });
    }
    try {
      const updatedComment = await Comments.findOneAndUpdate(
        {
          postId:new mongoose.Types.ObjectId(postId),
          _id:new mongoose.Types.ObjectId(commentId),
          nickname,
        },
        { comment },
        { new: true }
      );
      if (!updatedComment) {
        return res.status(404).json({ msg: "댓글을 찾을 수 없습니다." });
      }
      return res.status(200).json({ msg: "댓글이 정상적으로 수정되었습니다." });
    } catch (err) {
      return res.status(500).json({ msg: "예기치 못한 오류 발생" });
    }
  }
);

router.delete(
  "/posts/:postId/comments/:commentId",
  auth_middleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { nickname } = res.locals.user;
    if (!postId || !commentId) {
      return res.status(400).json({ msg: "url이 올바르지 않습니다" });
    }
    try {
      const deletedComment = await Comments.findOneAndDelete({
        postId:new mongoose.Types.ObjectId(postId),
        _id:new mongoose.Types.ObjectId(commentId),
        nickname,
      });
      if (!deletedComment) {
        return res.status(404).json({ msg: "댓글을 찾을 수 없습니다." });
      }
      return res.status(200).json({ msg: "댓글이 성공적으로 삭제되었습니다." });
    } catch (err) {
      return res.status(500).json({ msg: "예기치 못한 오류 발생" });
    }
  }
);

module.exports = router;
