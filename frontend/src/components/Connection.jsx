import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";
import { useDispatch , useSelector} from "react-redux";
import { addConnection } from "../redux/ConnectionSlice";
import ConnectionCard from "./ConnectionCard";


const Connection = ()=>{

    const dispatch = useDispatch();
    const connections = useSelector(store => store.connection.connection);
    console.log("conectoons",connections)

        const getAllConnections = async()=>{
            try{
                  const response = await axios.get(BASE_URL+'/api/v1/view/user/connections',{withCredentials:true});
                 dispatch(addConnection(response.data.data));
      
            }catch(err){
                console.log(err);
            }
        }

    useEffect(()=>{
        getAllConnections();
    },[])

    return (
        <div className="min-h-screen flex flex-col py-5">
            <h1 className="text-center text-3xl font-bold bg-gradient-to-tr from-violet-600 via-violet-400 to-violet-800 bg-clip-text text-transparent">Your Connections : </h1>
            <div className="space-y-6 flex flex-col items-center">
                {connections.length < 1 ? <h1>You dont have any connections</h1> : connections.map((item)=>{
                return <ConnectionCard key={item._id} item={item}/>}
               )}
        
             </div>
 
         
        </div>
    )
}

export default Connection;