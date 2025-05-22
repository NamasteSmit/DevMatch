import { createSlice } from "@reduxjs/toolkit";


const UserSlice = createSlice({
    name : "user",
    initialState : {
        user : null
    },
    reducers : {

        addUser : (state , action)=>{
            console.log("action.payload==>",action.payload);
             state.user = action.payload;
             console.log("state user",state.user)
        },

        removeUser : (state,action)=>{
            state.user = null
            console.log("after logout ==>",state.user);
        }
    }
})


export default UserSlice.reducer;

export const {addUser , removeUser } = UserSlice.actions;