import React, { useContext } from 'react';
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate, Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const { user } = useContext(UserAuthContext);
    
    console.log(user)
    const navigate = useNavigate()
    // console.log(user)
    // if(!user) {
    //     return navigate('/login')
    // }
    // return children
    return user ? children : <Navigate to="/login" />
}
