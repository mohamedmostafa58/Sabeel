const User=require("../models/User");
const sheikh=require('../models/Sheikh')
const delet=async ()=>{
  try{
   const users= await sheikh.find({});
    console.log(users);
  }catch(e){
    console.log(error)
  }
 
}
delet();