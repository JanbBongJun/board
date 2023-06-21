const express = require("express");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  try {
    const user = await User.findOne({ nickname });
    if (!user || password !== user.password) {
      return res
        .status(412)
        .json({ message: "닉네임 또는 패스워드를 확인해 주세요" });
    }
    const token = jwt.sign({nickname:user.nickname},'customized-secret-key')
    // console.log(token)
    res.cookie("Authorization",`Bearer ${token}`);
    res.status(200).json({token})
  } catch (err) {
    res.status(400).json({message:" 로그인에 실패하였습니다."})
  }
});
module.exports = router;

//로그인 기능 완료 ok