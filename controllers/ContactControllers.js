const ContactsModel = require("../models/ContactsModel");
const UsersModel = require("../models/UsersModel");
const MessagesModel = require("../models/MessagesModel");

module.exports.addContact = async (req, res) => {
  try {
    /**
     * Incoming Request Body
     */
    const { username } = req.body;

    const user_id = req.user_id;

    /**
     * Find Friend
     */
    const friend = await UsersModel.findOne({ username });

    if (!friend) {
      return res.status(400).json({ error: true, msg: "Username Not Found!" });
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
     * Add A Empty Message Document
     */
    const messages = await MessagesModel.create({ messages: [] });

    /**
     * Add First Contact For User
     */
    const is_user_contact_added = await ContactsModel.create({
      friend_id: friend.id,
      user_id,
      messages: messages._id,
    });
    /**
     * Add Second Contact For Friend
     */
    const is_friend_contact_added = await ContactsModel.create({
      friend_id: user_id,
      user_id: friend.id,
      messages: messages._id,
    });

    if (is_friend_contact_added && is_user_contact_added) {
      return res.json({ error: false, msg: "Contact Added!" });
    }

    return res.json({ error: true, msg: "Something Went Wrong!" });
  } catch (error) {
    return res.status(500).json({ error: true, msg: error.message });
  }
};
module.exports.getContacts = async (req, res) => {
  try {
    /**
     * User ID From JWT
     */
    const user_id = req.user_id;

    const contacts = await ContactsModel.find({
      user_id,
    })
      .populate("friend_id", ["-password", "-email"])
      .populate("messages");

    /**
     * @return Found Contacts
     */
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ error: true, msg: error.message });
  }
};
