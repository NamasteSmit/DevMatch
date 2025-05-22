import { useState } from "react";
import { useSelector } from "react-redux";
import EditUser from "./EditUser";

const Profile = () => {
  const user = useSelector((store) => store.user.user);
  console.log("User:", user);

  const [isEditable , setIsEditable] = useState(false);
 
    const bgColors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100'];
    const index = Math.floor(Math.random() * bgColors.length);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-500 to-pink-300 flex items-center ${isEditable ? "justify-between px-80":"justify-center"}`}>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl px-6 pt-20 pb-8 text-center">
        {/* Top Buttons */}
        <div className="absolute top-4 left-4 text-pink-500 font-medium flex items-center space-x-1">
          <span className="text-xl">👥</span>
          <span>Connect</span>
        </div>
        <div className="absolute top-4 right-4 text-pink-500 font-medium flex items-center space-x-1">
          <span className="text-xl">💬</span>
          <span>Message</span>
        </div>

        {/* Profile Image */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
          <img
            src={user?.photoUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <h2 className="mt-4 text-2xl font-semibold">{(user?.firstname + " " +  user?.lastname)|| "Samantha Jones"}</h2>
        <p className="text-gray-500 text-sm mb-2  font-semibold">
          {user?.gender + " "+ user?.age || "New York, United States"}
        </p>
        <div className="flex flex-wrap gap-4 justify-center items-center">
        {
            user?.skills.map((item,index)=>{
                return (
                    <span className={`border px-6 rounded-full flex items-center justify-center ${bgColors[index]} font-medium`}>{item.toLowerCase()}</span>
                )
            })
        }
        </div>

        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
          {user?.about || (
            <>
              Web Producer - Web Specialist <br />
              Columbia University - New York
            </>
          )}
        </p>

        {/* Stats */}
        <div className="flex justify-around mt-6 text-sm text-gray-700">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{user?.friends || 65}</span>
            <span>Friends</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{user?.photos || 43}</span>
            <span>Photos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{user?.comments || 21}</span>
            <span>Comments</span>
          </div>
        </div>

        {/* Button */}
        <button disabled={isEditable} onClick={()=>setIsEditable(true)} className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white disabled:bg-gray-200 disabled:cursor-not-allowed font-semibold shadow hover:scale-105 transition-transform">
          Edit Profile
        </button>
      </div>
      {
       isEditable &&  <EditUser setIsEditable={setIsEditable} user={user}/>
      }
    </div>
  );
};

export default Profile;
