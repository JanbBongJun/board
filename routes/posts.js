const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post.js");
const auth_middleware = require("../auth_middleware");
const { default: mongoose } = require("mongoose");
const user = require("../schemas/user.js");

router
  .route("/posts")
  .post(auth_middleware, async (req, res) => {
    const { nickname } = res.locals.user;
    const { title, content } = req.body;

    if (!nickname || !title || !content) {
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
    }

    try {
      await Posts.create({ nickname, title, content });
      return res.status(200).json({ msg: "잘 저장됬슈" });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: "예기치 못한 오류 발생",
      });
    }
  })
  .get(async (req, res) => {
    const pageNum = req.query.pageNum ? req.query.pageNum : 1;
    const pageSize = req.query.pageSize ? req.query.pageSize : 10;

    try {
      const data = await Posts.find()
        .select("-content")
        .skip((pageNum - 1) * pageSize)
        .limit(Number(pageSize));
      if (data.length === 0) {
        res.status(404).json({
          success: false,
          msg: "404 Not Found",
        });
        return;
      } else {
        res.status(200).json({
          success: true,
          page: pageNum,
          data: data,
        });
        return;
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, msg: "예기치 못한 오류 발생" });
    }
  });

router
  .get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
    }
    try {
      const data = await Posts.findOne({
        _id: mongoose.Types.ObjectId(postId),
      });
      if (!data) {
        return res.status(404).json({ msg: "데이터를 찾을 수 없습니다" });
      } else {
        return res.status(200).json({ success: true, data: data });
      }
    } catch (err) {
      return res.status(500).json({ msg: "예기치 못한 오류 발생" });
    }
  })
  .put("/posts/:postId", auth_middleware, async (req, res) => {
    const { postId } = req.params;
    const { title, content, nickname } = req.body;
    const user = res.locals.user;

    if (!nickname||!title || !content || !postId) {
      return res
        .status(400)
        .json({ msg: "비밀번호, 게시글, 타이틀이 존재하지 않습니다" });
    }
    if (user.nickname !== nickname) {
      return res
        .status(400)
        .json({ message: "수정 권한이 존재하지 않습니다." });
    }
    
    try {
      const updatePost = await Posts.findByIdAndUpdate(mongoose.Types.ObjectId(postId),{$set:{title, content}},{new:true});
      if (!updatePost) {
        return res
          .status(404)
          .json({ msg: "게시글 조회에 실패하였습니다." });
      }
      return res.status(200).json({ msg: "수정이 정상적으로 완료되었습니다" });
    } catch (err) {
      return res.status(500).json({ msg: "예기치 못한 오류 발생" });
    }
  })
  .delete("/posts/:postId", auth_middleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = req.body;
    if (!nickname || !postId) {
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }
    try {
      const data = await Posts.findOneAndDelete({ _id: mongoose.Types.ObjectId(postId) });
      if (!data) {
        return res.status(404).json({ msg: "게시글 조회에 실패하였습니다" });
      }
      return res.status(200).json({ msg: "게시글을 삭제하였습니다." });
    } catch (err) {
      return res.status(500).json({
        error: err,
        msg: "예기치 못한 오류 발생",
      });
    }
  });

module.exports = router;
