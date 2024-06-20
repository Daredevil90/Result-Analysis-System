import { User } from "../Models/User.model.js";
const options={
  httpOnly:true,
  secure:true
}

const generateAccessandRefreshToken=async (_id)=>{
  const user= await User.findById({_id});
   const refreshToken= await user.generateRefreshToken();
   const accessToken=  await user.generateAccessToken();
   user.refreshToken= refreshToken;
  await user.save({validateBeforeSave:false});
  return {refreshToken,accessToken};
}
const registerUser= async (req,res,next)=>{
try {
  const {password,email,fullname,collegeName,rollno,dob}= req.body;
     if(!password||!email||!fullname||!collegeName||!rollno||!dob){
      return res.status(401).json({
          "message":"Credentials missing or not received properly",
      })
     }
    const existingUser= await User.findOne({  $or:[{ fullname }, { email }]});
    if(existingUser){
      res.status(401).json({
          message:"User already Exists"
      })
    }
    else{
    const createdUser= await User.create({
      fullname:fullname,
      email:email,
      password:password,
      collegeName:collegeName,
      rollno:rollno,
      dob:dob
  })
  if(createdUser){
     res.status(200).json({
      message:"User created Successfully"
     })
  }

}
} catch (error) {
  console.log(error);

}
}
const loginUser= async(req,res)=>{
 try {
   const {email,password}= req.body;
   if(!email || !password){
     return res.status(401).json({message:"User information not received properly"});
   }
   const existingUser= await User.findOne({email});
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
   const updatedUser= await User.findById(existingUser._id).select("-refreshToken -password");
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
   const user= await User.findByIdAndUpdate(req.user._id,{$set:{$refreshToken:undefined}},{new:true});
   return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({message:"User logged out succesfully"});
 } catch (error) {
  console.log(error)
 }
}

export {registerUser,loginUser,logoutUser}