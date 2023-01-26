const express = require("express");
const {
  addContact,
  getContacts,
} = require("../controllers/ContactControllers");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

router.post("/add-contact", fetchUser, addContact);
router.get("/get-contacts", fetchUser, getContacts);

module.exports = router;
