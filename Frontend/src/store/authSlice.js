import { createSlice } from "@reduxjs/toolkit";
const initialState={
    status:false,
    userData:null,
    isAdmin:false
}
const authSlice= createSlice({
    name:"auth",
    initialState,
    reducers:{
       login:(state,action)=>{
         state.status=true;
         state.userData=action.payload;
       },
       logout:(state)=>{
        state.status=false;
        state.userData=null;
       },
       setAdmin:(state)=>{
        state.isAdmin=true;
       }
    }
})
export default  authSlice.reducer;
export const {login,logout,setAdmin}= authSlice.actions;