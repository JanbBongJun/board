const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post.js");
const { v4: uuidv4 } = require("uuid");

//쿼리 스트링을 받아서 페이지네이션
router.get("/posts", async (req, res) => {
  const pageNum = req.query.pageNum ? req.query.pageNum : 1;
  const pageSize = req.query.pageSize ? req.query.pageSize : 10;
  await Posts.find()
    .select("-content")
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => {
      if (err) {
        res.status(404).json({
          success: false,
          errorMessage: "404 Not Found",
        });
      } else {
        res.status(200).json({
          page: pageNum,
          data: data,
        });
      }
    });
});

router.post("/posts", (req, res) => {
  const savePost = async () => {
    try {
      const postId = uuidv4(); //임의의 문자열 생성
      const { user, password, title, content } = req.body;
      if (!user || !password || !title || !content) {
        return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
      }

      await Posts.create(postId, user, password, title, content);
      res.status(200).json({ msg: "잘 저장됬슈" });
    } catch (err) {
      if (err.code === 11000) {
        //postId값이 중복됬을경우에만 다시 실행
        savePost();
      } else {
        res.status(500).json({ msg: "예기치 못한 오률 발생" });
      }
    }
  };
  savePost();
});

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
  }
  await Posts.findOne({ postId })
    .select("-password")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
      }
      res.status(200).json({ data: data });
    });
});

router.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password, title, content } = req.body;
  if (!password || !title || !content || !postId) {
    return res
      .status(400)
      .json({ msg: "비밀번호, 게시글, 타이틀이 존재하지 않습니다" });
  }

  try {
    const updatePost = await Posts.findOneAndUpdate(
      { postId, password },
      { $set: { title, content } },
      { new: true }
    );
    if (!updatePost) {
      return res
        .status(404)
        .json({ msg: "pw 또는 postIdrk 올바르지 않습니다" });
    }
    return res.status(200).json({ msg: "수정이 정상적으로 완료되었습니다" });
  } catch (err) {
    return res.status(500).json({ msg: "예기치 못한 오률 발생" });
  }
});

router.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;
  if (!password || !postId) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    const data = await Posts.findOneAndDelete({ postId, password });
    if (!data) {
      return res.status(404).json({ msg: "게시글 조회에 실패하였습니다" });
    }
    res.status(200).json({ msg: "게시글을 삭제하였습니다." });
  } catch (err) {
    return res.status(500).json({ msg: "예기치 못한 오률 발생" });
  }
});

module.exports = router;