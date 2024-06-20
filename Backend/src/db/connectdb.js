import mongoose from "mongoose";
const connectdb=async ()=>{
    try {
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`); 
    console.log(`\n MONGODB connected DB Host: ${
        connectionInstance.connection.host
       }`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
export default connectdb;