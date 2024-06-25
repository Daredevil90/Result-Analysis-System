import {Router} from "express" 
import { registerUser,loginUser,logoutUser } from "../Controllers/institution.controllers.js";
import verifyIfUserisLoggedIn from "../Middlewares/verifyJWT.js";

const institutionRouter= Router();
institutionRouter.route("/register").post(registerUser);
institutionRouter.route("/login").post(loginUser);
// Secured Routes
institutionRouter.route("/logout").post(verifyIfUserisLoggedIn,logoutUser);

export default institutionRouter;
