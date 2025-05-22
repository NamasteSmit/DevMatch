import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";

const LoginPage = ()=>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError , setEmailError] = useState("");
  const [passwordError , setPasswordError] = useState('');
  const [error , setError] = useState("")

  const navigate = useNavigate();

   const dispatch = useDispatch();
   
  console.log(email , password)


  const handleSubmit = async(e) => {
    e.preventDefault();
    setEmailError("")
    setPasswordError("")
    setError("")

    try{
      const data = await axios.post(`${BASE_URL}/api/v1/user/login`,{
      emailId : email,
      password : password
    },{
      withCredentials:true
    })
    console.log("data----->",data)
    if(data?.data?.success){
      console.log("About to dispatch user:", data.data.user); // log before
       dispatch(addUser(data?.data?.user));
       console.log("Dispatched user!"); // log after
       navigate('/');

    }

    }catch(err){
       console.log(err?.response?.data)
       if(err.response.data.message.toLowerCase().includes("email")){
        setEmailError(err.response.data.message)
       }
       else if(err.response.data.message.toLowerCase().includes('password')){
        setPasswordError(err.response.data.message)
       }else if(err.response.data.message.toLowerCase().includes('unauthorized user')){
           setError("please signup first")
           setEmailError("invalid Email")
       }
    }
    
    
   
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {(emailError||error) && <p className="text-red-500 text-sm ">{emailError}</p>}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}


          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <p className="text-sm font-semibold text-center mt-2">New to DevTinder ? <Link to={'/signup'}><span className="text-violet-500">Signup</span></Link> </p>
      </div>
    </div>
  );
}

export default LoginPage