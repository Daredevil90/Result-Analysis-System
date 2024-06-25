import {Router} from "express" 
import { checkIfUserisAuthorizedtoBeAdmin, handleExcelSubmission, loginUser, logoutUser, registerUser } from "../Controllers/user.controllers.js";
import verifyIfUserisLoggedIn from "../Middlewares/verifyJWT.js";
import upload from "../Middlewares/multer.middleware.js"

const userRouter= Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
// Secured Routes
userRouter.route("/logout").post(verifyIfUserisLoggedIn,logoutUser);
userRouter.route("/AdminAccess").post(verifyIfUserisLoggedIn,checkIfUserisAuthorizedtoBeAdmin)
userRouter.route("/uploadExcel").post(verifyIfUserisLoggedIn,upload.single('excelFile'),handleExcelSubmission)
export default userRouter;
