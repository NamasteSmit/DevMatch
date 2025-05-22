import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addToFeed } from "../redux/feedSlice";
import UserCard from "./UserCard";
const Feed = ()=>{

    const feed = useSelector(store=>store.feed.feed);
    const currentIndex = useSelector(store => store.feed.currentIndex);
    
    const dispatch = useDispatch();

    const getFeed = async()=>{
        console.log("------getiing feed-----")
        const response = await axios.get(BASE_URL+"/api/v1/view/user/feed",{withCredentials:true})
        console.log('response',response)

        dispatch(addToFeed(response.data.data))

    }
 
    useEffect(()=>{
        getFeed();
    },[])
    const currentFeed = feed[currentIndex];


    return !currentFeed ? <div className="flex items-center justify-center py-10">No more feed</div> :  (
        <div className="flex min-h-screen justify-center mt-24 ">
           {(feed.length<1 && !currentFeed) ? <h1>No more feed</h1> : <UserCard key={currentFeed?._id} feed={currentFeed}/>
           }
        </div>
    )
}

export default Feed;