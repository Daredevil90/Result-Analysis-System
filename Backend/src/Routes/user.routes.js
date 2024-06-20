import {Router} from "express" 
import { loginUser, logoutUser, registerUser } from "../Controllers/user.controllers.js";
import verifyIfUserisLoggedIn from "../Middlewares/verifyJWT.js";

const userRouter= Router();
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
// Secured Routes
userRouter.route("/logout").post(verifyIfUserisLoggedIn,logoutUser);
export default userRouter;
