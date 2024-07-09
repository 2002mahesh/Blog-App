const {Router}=require('express');
const User=require("../models/user");
const {createUserToken}=require('../services/authentication');


const router=Router();

router.get("/signin",(req,res)=>{   
    res.render("signin");
});

router.get("/signup",(req,res)=>{   
    res.render("signUp");
});

router.post("/signin",async(req,res)=>{
    const {email,password}=req.body;
    try{
    const user= await User.matchPassword(email,password);
    return res.cookie("token",user).redirect("/");
    }catch(error)
    {
        res.render("signin",{error:error.message});
    }
})
router.post("/signup",async(req,res)=>{
    const {fullName,email,password}=req.body;

    const userEmail=await User.findOne({email});
    if(userEmail&&userEmail.email===email){
        return res.send("email already exist");
    }
    const user=await User.create({
        fullName,
        email,
        password
    });

  return res.redirect("/");
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
}

);

module.exports=router;