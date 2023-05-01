import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import User from '../../interfaces/User';
import LoginPage from '../../pages/Auth/Login';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('authToken');
  const validateAccessToken = (token:string|null)=>{
    if(!token){
      return false
    }
    const data:User = jwt_decode(token)
    const unixTimestamp = data.exp * 1000
    console.log(unixTimestamp)
    const now = new Date();
    const nowTimestamp = now.getTime();
    console.log(nowTimestamp)
    if (nowTimestamp > unixTimestamp) {
      return false;
    }
    return true
  }
  useEffect(() => {
    if (!accessToken) {
    navigate('/login');
    }
  }, [accessToken]);

  return validateAccessToken(accessToken) ? <>{children}</> : <LoginPage/>;
};

export default AuthWrapper;