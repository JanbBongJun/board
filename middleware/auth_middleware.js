const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;

  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || !authType)
    return res
      .status(401)
      .json({ message: "로그인 후 이용가능한 기능입니다." });

  try {
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    const user = await User.findById(userId).exec();
    if (!user) {
      res.clearCookie("authorization");
      return res.status(401).json({ message: " " });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    res.clearCookie("authorization");
    return res.status(401).json({message : "로그인 후 이용가능한 기능입니다"})
  }
};
