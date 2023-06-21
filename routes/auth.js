const express = require("express");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  try {
    const user = User.findOne({ nickname });
    if (!user || password !== user.password) {
      return res
        .status(412)
        .json({ message: "닉네임 또는 패스워드를 확인해 주세요" });
    }
    const token = jwt.sign({nickname:user.nickname},'customized-secret-key')
    res.cookie("Authorization",token);
    res.status(200).json({message: "로그인 성공"})
  } catch (err) {
    res.status(400).json({message:" 로그인에 실패하였습니다."})
  }
});

//로그인 기능 완료