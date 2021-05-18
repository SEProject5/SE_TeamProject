const jwt = require('jsonwebtoken');
const secretKey = 'shoppersKey';
const options = {
    algorithm : 'HS256',
    expiresIn : "30m",
    issuer : "shoppers"
}
module.exports={
    create : async (id) => {
        const payload ={
            user_id : id
        };
        const user_token ={
            user_token : jwt.sign(payload,secretKey,options),
        };
        return user_token;
    },

    verify : async (token) => {
        let decoded;
        try {
            decoded : jwt.verify(token,secretKey);
        }catch (err){
            if(err.message === 'jwt expired'){
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if(err.message === "invalid token"){
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            }else{
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}