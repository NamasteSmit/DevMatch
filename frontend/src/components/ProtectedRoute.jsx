import { useEffect } from "react";
import useAuth from "../Hooks/useAuth"
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({children})=>{
    const navigate = useNavigate();
    console.log('protected route....')

    const auth = useAuth();

    const {loading , isLoggedIn} = auth;

    useEffect(()=>{
        if(!loading && !isLoggedIn){
           return navigate('/login',{replace:true});
        }
    },[loading,isLoggedIn,navigate])

    if(loading){
        return (
            <div>
                Loading....
            </div>
        )
    }

   if(!isLoggedIn) return null ;

   return <Outlet/>

}

export default ProtectedRoute;