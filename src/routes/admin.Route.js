const express=require('express')
const router=express.Router();
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { getUsers, deleteUser } = require('../controllers/admin.Controller');

router.get('/users',adminMiddleware,getUsers);
router.delete('/users/:id',adminMiddleware,deleteUser);



module.exports=router;