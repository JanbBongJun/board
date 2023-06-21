//회원가입 로그인 기능 구현
const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  const nicknameRegexp = /^[a-zA-Z0-9]{3,}$/;
  if (!nicknameRegexp.test(nickname)) {
    return res
      .status(412)
      .json({ message: "닉네임 형식이 일치하지 않습니다." });
  } else if (confirm !== password) {
    return res.status(412).json({ message: "비밀번호가 일치하지 않습니다." });
  } else if (password.length < 4) {
    return res
      .status(412)
      .json({ message: "패스워드 형식이 일치하지 않습니다." });
  } else if (password.indexOf(nickname) !== -1) {
    return res
      .status(412)
      .json({ message: "패스워드에 닉네임이 포함되어 있습니다." });
  }
  try {
    const user = User.findOne({ nickname }).exec();
    if(user){
        return res.status(412).json({message: "중복된 닉네임입니다."});
    }
    User.create({nickname, password})
    res.status(201).json({message: "회원가입에 성공하였습니다."})
  } catch (err) {
    res.status(400).json({message: "요청한 데이터 형식이 올바르지 않습니다."})
  }
});

//회원가입 완료