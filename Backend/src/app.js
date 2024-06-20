import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
const app = express();
var whitelist = ["http://localhost:5173"]

app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    credentials:true,
}));
app.use(express.json({
    limit:"40kb",

}));
app.use(express.urlencoded({
    extended:true,
    limit:'40kb'
}));
app.use(express.static("public"));
app.use(cookieParser());
//routes
import userRouter from "./Routes/user.routes.js";


//routes declaration
app.use("/api/v1/users",userRouter);
export default app;