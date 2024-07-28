import { Router } from "express";
import {
  assignExamListAndReturnToUser,
  assignExamResultAndReturnToUser,
  checkIfUserIsAuthorizedToBeAdmin,
  handleExcelSubmission,
  loginUser,
  logoutUser,
  registerUser
} from "../Controllers/user.controllers.js";
import verifyIfUserIsLoggedIn from "../Middlewares/verifyJWT.js";
import upload from "../Middlewares/multer.middleware.js";

const userRouter = Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes
userRouter.use(verifyIfUserIsLoggedIn);  // Apply middleware to all routes below

userRouter.post("/logout", logoutUser);
userRouter.post("/admin-access", checkIfUserIsAuthorizedToBeAdmin);
userRouter.post("/upload-excel", upload.single('excelFile'), handleExcelSubmission);
userRouter.post("/fetch-result", assignExamListAndReturnToUser);
userRouter.post("/fetch-exam-result", assignExamResultAndReturnToUser);

export default userRouter;