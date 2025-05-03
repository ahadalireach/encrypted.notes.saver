import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { validatePassword } from "../utils/passwordValidator.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, user not found",
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

    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      await user.resetLoginAttempts();

      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      await user.handleFailedLogin();

      return res.status(401).json({
        success: false,
        message: "Invalid password",
        attemptsLeft: Math.max(0, 5 - user.failedLoginAttempts),
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -failedLoginAttempts -accountLocked -lockUntil"
    );

    if (user) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        // Validate password strength
        const passwordValidation = validatePassword(req.body.password);
        if (!passwordValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: passwordValidation.message,
          });
        }

        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
        },
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
