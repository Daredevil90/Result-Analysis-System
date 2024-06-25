import { Institution } from "../Models/Institution.model.js";
import bcrypt from "bcrypt"
const options={
  httpOnly:true,
  secure:true
}

const generateAccessandRefreshToken=async (_id)=>{
  const user= await Institution.findById({_id});
   const refreshToken= await Institution.generateRefreshToken();
   const accessToken=  await Institution.generateAccessToken();
   user.refreshToken= refreshToken;
  await user.save({validateBeforeSave:false});
  return {refreshToken,accessToken};
}
const registerUser= async (req,res)=>{
try {
const {college_name,domain,email,password,college_address}= req.body;
console.log(req.body)
  if(!password||!email||!college_name||!domain||!college_address){
      return res.status(401).json({
          "message":"Credentials missing or not received properly", })
  }
const existingUser= await Institution.findOne({  $or:[{ college_name }, { email }]});
  if(existingUser){
      res.status(401).json({
          message:"User already Exists"
      })
    }
    
const createdUser= await Institution.create({
      email:email,
      password:password,
      name:college_name,
      domain_name:domain,
      address:college_address,
  })
    if(createdUser){
     res.status(200).json({
      message:"User created Successfully"
     })
  }
} 
catch (error) {
  console.log(error);
}
}
const loginUser= async(req,res)=>{
 try {
   const {email,password}= req.body;
   if(!email || !password){
     return res.status(401).json({message:"User information not received properly"});
   }
   const existingUser= await Institution.findOne({email});
   if(!existingUser){
     return res.status(400).json({
       message:"User does not exist with given credentials pls register"
     })
   }
   const isPasswordValid=await existingUser.isPasswordCorrect(password);
 
   if(!isPasswordValid)
     {
       return res.status(400).json({message:"Password incorrect pls try again"});
     }
   const{ accessToken, refreshToken}=await generateAccessandRefreshToken(existingUser._id);
   console.log(accessToken);
   console.log(refreshToken);
   if(!accessToken){
     return res.status(400).json({message: "Error in creating accessToken"});
   }
   if(!refreshToken){
     return res.status(400).json({message: "Error in creating refreshToken"});
   }
   const updatedUser= await Institution.findById(existingUser._id).select("-refreshToken -password");
    if(!updatedUser){
    return res.status(400).json({message:"User not found"});
    }
    console.log(updatedUser);
    return res.cookie('accessToken',accessToken,options).cookie("refreshToken",refreshToken,options).status(200).json({updatedUser,refreshToken,accessToken,message:"User logged in successfully"});
 } catch (error) {
  console.log(error)
 }  
}
const logoutUser= async (req,res)=>{

 try {
   if(!req.user){
     return res.json({message:"User is not authenticated"});
   }
   const user= await Institution.findByIdAndUpdate(req.user._id,{$set:{$refreshToken:undefined}},{new:true});
   if(!user){
    res.status(401).json({message:"Invalid user"})
   }
   return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({message:"User logged out succesfully"});
 } catch (error) {
  console.log(error)
 }
}

export {registerUser,loginUser,logoutUser}