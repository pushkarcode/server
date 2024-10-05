const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "Email is already registered",
      });
    }
    const checkUserName = await User.findOne({ userName });
    if (checkUserName) {
      return res.json({
        success: false,
        message: "User name is already taken, please try some other user name",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (err) {
    console.log("Error in register - " + err);
    res.status(500).json({
      success: false,
      message: "Some error occured in registering user",
    });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exists! Please register first",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // creating the token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // sending token with cookie
    // res.cookie('token', token, {httpOnly: true, secure: false}).json({
    //     success: true,
    //     message: "Logged in successfully",
    //     user: {
    //         email: user.email,
    //         role: user.role,
    //         id: user._id,
    //         userName: user.userName,
    //     }
    // })

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (err) {
    console.log("Error in login - " + err);
    res.status(500).json({
      success: false,
      message: "Some error occured while login",
    });
  }
};

// logout
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

// auth-middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorised user",
//     });

//   try {
//     const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({
//       success: false,
//       message: "Unauthorised user",
//     });
//   }
// };

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
