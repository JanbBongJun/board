const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");
  // console.log("Authorization:"+Authorization)
  // console.log("authType:"+authType);
  // console.log("authToken:"+authToken)
  if (!authToken || authType !== "Bearer") {
    console.log(authToken);
    console.log(authType);
    return res
      .status(401)
      .json({ message: "로그인 후 이용가능한 기능입니다." });
  }
  try {
    const { nickname } = jwt.verify(authToken, "customized-secret-key");
    const user = await User.findOne({ nickname }).exec();
    // console.log(user)
    if (!user) {
      res.clearCookie("Authorization");
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    res.clearCookie("Authorization");
    return res.status(402).json({ message: "로그인 후 이용가능한 기능입니다" });
  }
};

//권한확인 완료
