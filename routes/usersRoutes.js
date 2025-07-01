const express = require('express');
const { registerUser, loginUser, currentUser } = require('../controllers/usersControllers');
const validateTokenHandler = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current-user", validateTokenHandler, currentUser);

module.exports = router;