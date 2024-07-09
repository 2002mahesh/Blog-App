const express=require('express');
const path=require('path');
const userRoute=require('./Routes/user');
const blogRoute=require('./Routes/blog');
const connectDB=require('./connect/dbConnect');
const { checkAuthenticationCookie } = require('./middlerware/authentication');
const cookieparser=require('cookie-parser');
const Blog=require('./models/blog');





connectDB;
const app=express();

app.use(express.json());
app.use(express.static(path.resolve("./Images")));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(checkAuthenticationCookie('token'));


app.get("/",async(req,res)=>{
    const allBlog=await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allBlog
    });
})





app.use("/user",userRoute);
app.use("/blog",blogRoute);








app.listen(3000,()=>{
    console.log('server is running on port 3000');
});