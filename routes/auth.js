const express = require("express");
const User=require('../models/Sheikh')
// const { protect, admin } = require("../middlewares/auth");
const {
  register,
  login,
  verifyuser,
  getUserByToken,
} = require("../controllers/auth");
const router = express.Router();
router.route("/register").post(register);
router.route("/delet").delete(async(req,res,next)=>{
  try{
    const deleted=await User.deleteMany({});
    console.log("deleted")
    res.json({
      deleted:'sucess'
    })
  }catch(e){
    console.log(e);
    res.json({
      deleted:e
    })
  }
})
router.route("/login").post(login);
router.route("/user").get(getUserByToken);
module.exports = router;
