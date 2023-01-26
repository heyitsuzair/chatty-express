const UsersModel = require("../models/UsersModel");
const bcrypt = require("bcryptjs");

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
