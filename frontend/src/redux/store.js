import {configureStore} from "@reduxjs/toolkit"
import UserSlice from "./userSlice"
import feedSlice from "./feedSlice"
import connectionSlice from "./ConnectionSlice"
import requestSlice from './requestSlice'

const store = configureStore({
    reducer : {
         user : UserSlice,
         feed : feedSlice,
         connection : connectionSlice,
         request : requestSlice
    }
})

export default store;