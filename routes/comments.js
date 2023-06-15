const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment.js");

router.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const commentId = uuidv4(); //임의의 문자열 생성
  const { user, password, comment } = req.body;

  if (!user || !password || !comment || !postId) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
  }

  const createComment = async () => {
    try {
      await Comments.create(user, password, comment, commentId, postId);
    } catch (err) {
      if (err.code === 11000) {
        //만약에 commentId가 중첩되었을 경우
        createComment();
      } else {
        res.status(500).json({ msg: "예기치 못한 오률 발생" });
      }
    }
  };
  createComment();
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
    return res.status(200).json({
      data: await Comments.find({ postId }).select("-password -postId"),
    });
  } catch (err) {
    res.status(500).json({ msg: "예기치 못한 오률 발생" });
  }
});

router.put("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { password, comment } = req.body;
  if (!postId || !commentId) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
  } else if (!password || !comment) {
    return res.status(400).json({ msg: "댓글 또는 PW를 입력해 주세요" });
  }
  try {
    const comments = await Comments.findOneAndUpdate(
      { postId, commentId, password },
      { comment },
      { new: true }
    );
  } catch (err) {
    res.status(500).json({ msg: "예기치 못한 오률 발생" });
  }
});

router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  if (!postId || !commentId) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다" });
  }
  try{
    const deletedComments = await Comments.findOneAndDelete({postId,commentId})
    
    if(!deletedComments){
        return res.status(404).json({ msg: "댓글 조회에 실패하였습니다." });
    }
    res.status(200).json({msg:"댓글이 성공적으로 삭제되었습니다."});
  }catch(err){
    res.status(500).json({ msg: "예기치 못한 오류 발생" });
  }
});

module.exports = router;
