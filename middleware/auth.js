const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
    try{
       const token = req.header('x-auth-token');
       if(!token){
        return res.status(401).json({msg:"no auth token, access denied"})
       }
       const ifverfied = jwt.verify(token,'passwordKey');
       if(!ifverfied) return res.status(401).json({msg:'Token verification failed. authorization denied'})

       req.user = ifverfied.id;
       req.token = token;
       next();
    }catch(e){
       res.status(500).json({err:err.message});
    }
}

module.exports = auth;