const {Router}=require('express');
const router=Router();
const multer=require('multer');
const path=require('path');
const Blog=require('../models/blog');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,`./Images/`);
    },
    filename:(req,file,cb)=>{
        const filename=`${Date.now()}-${file.originalname}`;
        cb(null,filename);
    },
}); 

const upload=multer({storage:storage});
router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    });

})

router.post("/",upload.single("coverimage"),async(req,res)=>{
    const {title,body}=req.body;
    const coverImageURL=(req.file.filename).split('-')[1];
    console.log(req.file.filename);
    const blog= await Blog.create({
        title,
        body,
        coverImageURL:`/Images/${coverImageURL}`,
        createdBy:req.user._id
    });
    // console.log(coverImageURL);
    return res.redirect(`/`);
});

module.exports=router