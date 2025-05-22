import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { BASE_URL } from '../utils/constants';
const useAuth = () => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState({
    loading: true,
    isLoggedIn: false,
  });

  console.log(auth)

  const verifyUser = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/verify`,{}, {
        withCredentials: true,
      });

      console.log("User verified:", res.data);

      if (res.data.success) {
        dispatch(addUser(res.data.user))
        setAuth({
          loading: false,
          isLoggedIn: true,
        });
      } else {
        setAuth({
          loading: false,
          isLoggedIn: false,
        });
      }
    } catch (err) {
      console.log("Error verifying user:", err);
      setAuth({
        loading: false,
        isLoggedIn: false,
      });
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return auth;
};

export default useAuth;
