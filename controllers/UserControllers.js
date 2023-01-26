const UsersModel = require("../models/UsersModel");
const ContactsModel = require("../models/ContactsModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  try {
    /**
     * Incoming Request Body
     */
    const { username, email, password } = req.body;

    /**
     * Check Whether Username And Email Is Unique
     *
     * @true Continue
     *
     * @false return 400 Error
     */
    const does_username_exist = await UsersModel.findOne({ username });
    const does_email_exist = await UsersModel.findOne({ email });

    if (does_email_exist || does_username_exist) {
      return res
        .status(400)
        .json({ error: true, msg: "Account Already Exists!" });
    }

    /**
     * Hash Password
     */
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    /**
     * Insert Data
     */
    const is_user_added = await UsersModel.create({
      username,
      email,
      password: hash,
    });

    if (is_user_added) {
      return res.json({ error: false, msg: "Account Created!" });
    }
    return res.status(400).json({ error: true, msg: "Something Went Wrong" });
  } catch (error) {
    return res.status(500).json({ error: true, msg: error.message });
  }
};
module.exports.login = async (req, res) => {
  try {
    /**
     * Incoming Username And Password
     */
    const { username, password } = req.body;

    /**
     * Find User Against Username
     */
    const user = await UsersModel.findOne({ username });

    /**
     * @return Return An Error If Username Is Invalid
     */
    if (!user) {
      return res
        .status(403)
        .json({ error: true, msg: "Invalid Username Or Password!" });
    }
    /**
     * Compare Password
     */
    const passwordCompare = await bcrypt.compare(password, user.password);
    /**
     * @return Return An Error If Password Is Invalid
     */
    if (!passwordCompare) {
      return res
        .status(403)
        .json({ error: true, msg: "Invalid Username Or Password!" });
    }

    /**
     * Generating JWT And Sending To Request
     */
    const data = {
      user_id: user._id,
    };

    const token = jwt.sign(data, process.env.JWT_SECRET);

    /**
     * @return Return A Token To Request With Logged In User "ID" In Token
     */
    return res.status(200).json({ error: false, token });
  } catch (error) {
    return res.status(500).json({ error: true, msg: error.message });
  }
};
