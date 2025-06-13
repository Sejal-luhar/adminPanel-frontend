const express=require('express');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { currentUser, signup, login, logout, updateProfile, getAllUsers } = require('../controllers/user.Controller');
const router=express.Router();

router.get('/currentUser',authenticateUser,currentUser);
router.post('/signup',signup);
router.post('/login',login)
router.post('/logout',authenticateUser,logout);
router.put("/profile",authenticateUser,updateProfile);

module.exports=router;