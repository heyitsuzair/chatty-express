const express = require("express");
const { addContact } = require("../controllers/ContactControllers");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

router.post("/add-contact", fetchUser, addContact);

module.exports = router;
