const mongoose=require('mongoose');
const {createHmac,randomBytes}=require('node:crypto');
const {createTokenUser}=require('../services/authentication');

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        
    },
    profileImageUrl:{
        type:String,
        default:"Images/user.png"
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    }
  
},{timestamps:true});

userSchema.pre('save',function(next){
    const user=this;

    if(!user.isModified('password')){
        return;
    }

   const salt=randomBytes(16).toString('hex');

   const hash=createHmac('sha256',salt)
   .update(user.password)
   .digest('hex');
   user.salt=salt;
   user.password=hash;


   next();

})

userSchema.static('matchPassword', async function(email,password){
    const user= await this.findOne({email});
    if(!user){ throw new Error('user not found');}

    const hashPassword=user.password;
    
    const userProvidePassword=createHmac('sha256',user.salt)
    .update(password)
    .digest('hex');
    if (hashPassword!==userProvidePassword)
        throw new Error('Incorrect Password');

   const token=createTokenUser(user);

   return token;
});
const User=mongoose.model('User',userSchema);
module.exports=User;