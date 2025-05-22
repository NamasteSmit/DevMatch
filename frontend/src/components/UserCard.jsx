import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { nextProfile , removeFromFeed} from "../redux/feedSlice";

const UserCard = ({feed}) => {
    const dispatch = useDispatch();
    console.log("fe",feed)
    const handleIgnoreUser = async()=>{
      const response = await axios.post(`${BASE_URL}/api/v1/request/send/ignored/${feed._id}`,{},{withCredentials:true});
      console.log(response);
      dispatch(nextProfile());
      dispatch(removeFromFeed(feed._id))
    }

    const handleIntrestedUser = async()=>{
      const response = await axios.post(`${BASE_URL}/api/v1/request/send/intrested/${feed._id}`,{},{withCredentials:true});
      console.log(response);
      dispatch(nextProfile());
      dispatch(removeFromFeed(feed._id))
    }
  return (
    <div className="card bg-base-100 w-96 h-2/5 shadow-lg">
      <div className="w-96 h-96">
        <img className="w-full h-full object-cover"
          src={feed.photoUrl}
          alt=""
        />
      </div>
      <div className="card-body">
        <h2 className="card-title">
          {feed.firstname + " " + feed.lastname}
          <div className="badge badge-secondary">{feed.gender + ' ' + feed.age}</div>
        </h2>
        <p>
          {feed.about}
        </p>
        <div className="card-actions justify-end">
            {
                feed?.skills.map((item)=>{
                    return <div className="badge badge-outline">{item}</div>
                })
            }
        </div>
        <div className="mt-2 flex space-x-5  justify-center items-center">
            <button onClick={handleIgnoreUser} className="btn btn-soft btn-secondary">Ignore</button>
            <button onClick={handleIntrestedUser} className="btn btn-soft btn-accent">Intrested</button>
        </div>
      </div>
    </div>
  );
};


export default UserCard;