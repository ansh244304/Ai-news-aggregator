import authService from '../services/authService.js';


const register = async (req, res) => {
    try{
        const result = await authService.register(req, res);
        if (result) {
            res.status(201).json({message:'User registered successfully', user: result});
        }
    }catch(error){
        res.status(500).json({message:'Internal server error'});
    }
}   
const login = async (req, res) => {
    try{
        const result = await authService.login(req, res);   
        if (result) {
            res.status(200).json({message:'User logged in successfully', token: result});
        }
    }catch(error){
        res.status(500).json({message:'Internal server error'});
    }
}  

const forgotPassword = async (req, res) => {
    try{
        const result=await authService.forgotPassword(req, res);
        if (result) {
            res.status(200).json({message:'Password reset link sent to email', token: result});
        }   

    }catch(error){
        res.status(500).json({message:'Internal server error'});
    }
};

