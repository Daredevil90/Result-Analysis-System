import mongoose, { mongo } from "mongoose";
import { User } from "./User.model";


const resultSchema= new mongoose.Schema({

total_Subjects_and_Marks_Info:{
    type:Object,
    require:true
}
},{timestamps:true})

export const {Result}= mongoose.model("Result",resultSchema);