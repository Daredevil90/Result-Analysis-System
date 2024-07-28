import { Institution } from "../Models/Institution.model.js";
import Result from "../Models/Result.model.js";
import { User } from "../Models/User.model.js";
import ExcelJS from 'exceljs';
import fs from "fs";

const options = {
  httpOnly: true,
  secure: true
};

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { refreshToken, accessToken };
};

const registerUser = async (req, res) => {
  try {
    const { password, email, fullname, collegeName, rollno, dob } = req.body;
    if (!password || !email || !fullname || !collegeName || !rollno || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ fullname }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const createdUser = await User.create({
      fullname, email, password, collegeName, rollno, dob
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res
      .cookie('accessToken', accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({ user: userResponse, message: "User logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkIfUserIsAuthorizedToBeAdmin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.user._id);
    const institution = await Institution.findOne({ name: user.collegeName }).select("-password -address -accessToken");
    
    if (!institution) {
      return res.status(404).json({ message: "Institution not registered" });
    }
    
    if (user.email.includes(institution.domain_name)) {
      user.isAdmin = true;
      await user.save();
      return res.status(200).json({ message: "Granted admin rights" });
    } else {
      return res.status(403).json({ message: "Sign up using institution email to gain admin access" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleExcelSubmission = async (req, res) => {
  try {
    const { exam_name, exam_date, exam_sem } = req.body;
    if (!exam_name || !exam_date || !exam_sem) {
      return res.status(400).json({ message: "Missing required information" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];
    
    const jsonData = [];
    worksheet.eachRow((row, rowNumber) => {
      jsonData.push(row.values.slice(1));
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    const record = await Result.create({
      total_Subjects_and_Marks_Info: jsonData,
      domain: req.user.collegeName,
      examination_name: exam_name,
      exam_date,
      semester: exam_sem
    });

    res.status(201).json({ message: "Excel file uploaded successfully", data: jsonData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const assignExamListAndReturnToUser = async (req, res) => {
  try {
    const record = await Result.find({
      domain: req.user.collegeName,
      examination_name: { $in: ["IA-1", "IA-2", "Mid-Semester", "End-Semester"] }
    }).select("-domain -createdAt -updatedAt");

    if (!record.length) {
      return res.status(404).json({ message: "No results found" });
    }
    
    res.status(200).json({ message: "Result categories successfully found", record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const assignExamResultAndReturnToUser = async (req, res) => {
  try {
    const { exam_name, exam_sem } = req.body;
    const resultRecord = await Result.findOne({
      domain: req.user.collegeName,
      examination_name: exam_name,
      semester: exam_sem
    });

    if (!resultRecord) {
      return res.status(404).json({ message: "Exam result not found" });
    }
    console.log(resultRecord)
    const headers=resultRecord.total_Subjects_and_Marks_Info[0]
    console.log(headers)
    const filteredData = resultRecord.total_Subjects_and_Marks_Info.find(item => item[0] === req.user.rollno);
    if (!filteredData) {
      return res.status(404).json({ message: "User result not found in affiliated college" });
    }

    res.status(200).json({ message: "Exam result retrieved successfully", data: filteredData,headers:headers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  checkIfUserIsAuthorizedToBeAdmin,
  handleExcelSubmission,
  assignExamResultAndReturnToUser,
  assignExamListAndReturnToUser
};