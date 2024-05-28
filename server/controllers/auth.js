import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: 10,
            impressions: 10
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



export const login = async(req,res) =>{
    try{
const {email,password} =req.body ;
const user = await User.findOne({email:email})
if(!user){
    res.status(400).json("User donot exist");
}
const isMatch= await bcrypt.compare(password,user.password);
if(!isMatch){
    res.status(400).json("Invalid Creds");
}
const token=jwt.sign({id:user._id},process.env.SECRET)
delete user.password
res.status(200).json({token,user});

    }
    catch(err){
        console.log(err)
    }
}