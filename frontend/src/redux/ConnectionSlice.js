import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name : 'connections',
    initialState : {
        connection : []
    },
    reducers : {

        addConnection : (state,action)=>{
              state.connection = action.payload;
        },
        removeConnection : (state,action)=>{
            state.connection = [];
        }

    }
})

export default connectionSlice.reducer;
export const {addConnection,removeConnection} = connectionSlice.actions;