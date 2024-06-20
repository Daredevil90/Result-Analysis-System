import dotenv from "dotenv"
import app from "./app.js"
import connectdb from "./db/connectdb.js";
dotenv.config({
    path:'./env'
});
connectdb().then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
    console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Mongodb connection failed",error)
})
