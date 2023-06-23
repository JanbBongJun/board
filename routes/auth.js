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
    const token = jwt.sign({nickname:user.nickname},'customized-secret-key',{ expiresIn: "1h" });
    console.log(token)
    res.cookie("Authorization",`Bearer ${token}`);
    res.status(200).json({token})
  } catch (err) {
    res.status(400).json({message:" 로그인에 실패하였습니다."})
  }
});
module.exports = router;

//로그인 기능 완료 ok
//header.payload.signature = 토큰을 통해서 암호화된 값 = 금고
//금고를 해제하기 위한 key 
//금고 안에 저장된 payload가 있을겁니다.