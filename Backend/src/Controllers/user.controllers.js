import { Institution } from "../Models/Institution.model.js";
import Result  from "../Models/Result.model.js";
import { User } from "../Models/User.model.js";
import ExcelJS from 'exceljs';
import fs from "fs"
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
const registerUser= async (req,res)=>{
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
    return res.cookie('accessToken',accessToken,options).cookie("refreshToken",refreshToken,options).status(200).json({updatedUser,accessToken,message:"User logged in successfully"});
 } catch (error) {
  console.log(error)
 }  
}
const logoutUser= async (req,res)=>{

 try {
   if(!req.user){
     return res.status(401).json({message:"User is not authenticated"});
   }
   const user= await User.findByIdAndUpdate(req.user._id,{$set:{$refreshToken:undefined}},{new:true});
   return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({message:"User logged out succesfully"});
 } catch (error) {
  console.log(error)
 }
}
const checkIfUserisAuthorizedtoBeAdmin=async (req,res)=>{
  try {
    if(!req.user){
      return res.status(401).json({message:"User is not authenticated"});
    }
   const userrecord = await User.findById(req.user._id);
   const {collegeName}= userrecord;
   console.log(collegeName)
   const record= await Institution.findOne({name:collegeName}).select("-password -address -accessToken")
   if(!record){
    return res.status(401).json({message:"Institution or Organization not Registered"})
   }
   if(userrecord.email.includes(record.domain_name)){
      userrecord.isAdmin=true;
       const currentUser= await userrecord.save();
     if(!currentUser){
      return res.status(500).json(currentUser);
     }
     return res.status(200).json("Granted Admin Rights");
     }
     else{
      return res.status(401).json({message:"Sign Up using Institution email to gain Admin Access"})
     }
  }
   catch (error) {
    console.log(error);
   }
}
const handleExcelSubmission=async (req,res)=>{
try {
  const {exam_name,exam_date,exam_sem} = req.body;
  if(!exam_name || !exam_date){
   return res.status(401).json({message:"Information not sent properly or missing"})
  }
  const excelFile = req.file
  if(!excelFile){
    return res.status(400).json({message:"Error in File Upload"})
  }
    const filePath = req.file.path;
   const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Get the first worksheet
    const worksheet = workbook.worksheets[0];

    // Convert worksheet to JSON
    const jsonData = [];
    worksheet.eachRow((row, rowNumber) => {
      const rowValues = row.values.slice(1); // Remove the empty first element
      jsonData.push(rowValues);
    });
    console.log(jsonData)
    if(jsonData){
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });
  }
  const record= await Result.create({
    total_Subjects_and_Marks_Info:jsonData,
    domain:req.user.collegeName,
    examination_name:exam_name,
    exam_date:exam_date,
    semester:exam_sem
  })
  if(!record){
    return res.status(500).json({message:"Internal Server Error"});
  }

  return res.status(200).json({jsonData,message:"Excel File uploaded Successfully"})
}
catch (error) {
  return res.status(500).json({message:error.errorResponse.errmsg})
}
}
const assignExamResultandReturntoUser=async (req,res)=>{ 
  const {exam_name,exam_sem}= req.body;
const resultRecord= await Result.find({$and:[{domain:req.user.collegeName},{examination_name:exam_name,},{semester:exam_sem}]});
if(!resultRecord){
  return res.status(500).json({message:"Exam Result has not been uploaded by Admin"})
}
const filteredData=resultRecord.filter((item)=>{item[0]==req.user.rollno})
if(!filteredData){
  return res.status(400).json({message:"User does not have a result in afffiliated College"})
}
return res.status(200).json({filteredData,message:"Exam Result Retrieved Successfully"});
}
export {registerUser,loginUser,logoutUser,checkIfUserisAuthorizedtoBeAdmin,handleExcelSubmission,assignExamResultandReturntoUser}