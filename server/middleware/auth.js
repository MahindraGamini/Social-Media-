import jwt  from  'jsonwebtoken'
export const verifyToken=async(req,res,next) =>{
    try{
        let token=req.header("Authorization");
        if(!token){
            res.status(403).json("User Donot Exist");
        }if(token.startsWith("Bearer")){
            token=token.slice(7,token.length).trimLeft();
        }

        const verified = jwt.verify(token,process.env.SECRET)
        req.user=verified
        next();
    }
    catch(err){
        console.log(err)
    }
}