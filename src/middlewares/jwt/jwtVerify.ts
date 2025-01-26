import jwt from "jsonwebtoken";
import loginModel from "../../database/models/admin/login";

function jwtVerify(req, res, next) {
  const token = req.headers["authorization"];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "User not authenticated", errorCode: 403 });
    }

    const userSchema = await loginModel.findOne({ username: decoded.userId });

    if (!userSchema) {
      return res
        .status(403)
        .json({ error: "User not authenticated", errorCode: 403 });
    }

    req.userId = decoded.userId;
    next();
  });
}

export default jwtVerify;
