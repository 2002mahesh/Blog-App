const jwt=require('jsonwebtoken');
const secrete="JustMG45";


function createTokenUser(user)
{
    const payload={
        _id:user._id,
        email:user.email,
        role:user.role,
        profileImageUrl:user.profileImageUrl
    };

    const token=jwt.sign(payload,secrete,{expiresIn:'1d'});
    return token;


}

function validateToken(token)
{
    const payload=jwt.verify(token,secrete);
    return payload;

}

module.exports={
    createTokenUser
    ,
    validateToken
};