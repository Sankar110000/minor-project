const bcrypt = require('bcrypt')
const User = require("../models/user.schema")
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exist",
      });
    }

    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res.json({
          success: false,
          message: "Error while hasing the pass",
        });
      }

      const newUser = new User({
        fullname,
        email,
        password: hash,
        role,
      });

      const savedUser = await newUser.save();
      return res.json({
        success: true,
        savedUser,
        message: "User registered successfully",
      });
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while registering the user",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.json({
        success: false,
        message: "User doesnot exist",
      });
    }

    bcrypt.compare(password, existingUser.password, function (err, result) {
      if (err) {
        return res.json({
          success: false,
          message: "Error while comapiring the password",
        });
      }

      if (!result) {
        return res.json({
          success: false,
          message: "Wrong password",
        });
      }

      const token = jwt.sign(
        {
          _id: existingUser._id,
          usernname: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "Login successful",
        user: {
          _id: existingUser._id,
          fullname: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        },
        token
      });
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while logggin in the user",
    });
  }
};