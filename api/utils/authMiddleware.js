import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.accountLocked) {
      if (user.lockUntil && user.lockUntil > new Date()) {
        return res.status(401).json({
          success: false,
          message: `Account locked. Try again after ${new Date(
            user.lockUntil
          ).toLocaleString()}`,
        });
      } else {
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};
