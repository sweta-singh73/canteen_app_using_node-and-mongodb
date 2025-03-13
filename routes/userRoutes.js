const express = require('express');
const { getUserByName, viewUser,  } = require('../controllers/authController');
const router = express.Router();

//routes

router.get("/get-emp-name", getUserByName);
router.get("/view-employee", viewUser);


module.exports = router;