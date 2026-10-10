const user=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { sendEmail } = require("../services/emailService");
const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        // check if user already exists
        const existingUser=await user.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }
        const hashedpassword=await bcrypt.hash(password,10);

        const newUser=user.create({
            name,
            email,
            password:hashedpassword
        });
       
        res.status(201).json({message:'User registered successfully'});
   return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
    }catch(error){
        res.status(500).json({message:'Internal server error'});
    }
};

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const existingUser=await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:'User does not exist'});
        }
        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'});
        }
        const token=jwt.sign({
            id:existingUser._id
        },
        process.env.JWT_SECRET,
        {expiresIn:'1h'});


        res.status(200).json({message:'Login successful',token});
    }catch(error){
        res.status(500).json({message:'Internal server error'});
    }
};


const logout = async (req, res) => {
    try {
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        // Find user
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }

        // Generate reset token
        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Reset URL
        const url =
            `http://localhost:3000/reset-password/${token}`;

        const subject = "Password Reset Request";

        const html = `
            <h2>Password Reset</h2>

            <p>Hello ${existingUser.name},</p>

            <p>
                You requested to reset your password.
            </p>

            <p>
                Click the link below to reset your password:
            </p>

            <a href="${url}">
                Reset Password
            </a>

            <p>
                This link will expire in 1 hour.
            </p>

            <p>
                If you did not request this, please ignore this email.
            </p>
        `;

        // Send email
        await sendEmail(
            existingUser.email,
            subject,
            html
        );

        return res.status(200).json({
            message: "Password reset email sent"
        });

    } catch (error) {

        console.log("Forgot password error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    forgotPassword
};
