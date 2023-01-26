const ContactsModel = require("../models/ContactsModel");
const UsersModel = require("../models/UsersModel");
const MessagesModel = require("../models/MessagesModel");

module.exports.addContact = async (req, res) => {
  try {
    /**
     * Incoming Request Body
     */
    const { friend_email } = req.body;

    const user_id = req.user_id;

    /**
     * Find Friend
     */
    const friend = await UsersModel.findOne({ email: friend_email });

    if (!friend) {
      return res.status(400).json({ error: true, msg: "Invalid Email!" });
    }

    if (user_id === friend.id) {
      return res
        .status(400)
        .json({ error: true, msg: "You Cannot Add Yourself!" });
    }

    /**
     * Check if the user already have this friend in contact collection
     *
     * @true @return Error
     *
     * @false Continue
     */

    const is_already_in_contact = await ContactsModel.findOne({
      user_id,
      friend_id: friend.id,
    });

    if (is_already_in_contact) {
      return res
        .status(400)
        .json({ error: true, msg: "Contact Already In List!" });
    }

    /**
     * Add Contact
     */
    const is_contact_added = await ContactsModel.create({
      friend_id: friend.id,
      user_id,
    });

    return res.json({ error: false, msg: "Contact Added!" });
  } catch (error) {
    return res.status(500).json({ error: true, msg: error.message });
  }
};
