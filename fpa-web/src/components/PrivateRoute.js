import React, { useContext } from 'react';
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate, Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    // const { user } = useContext(UserAuthContext);

    let utilizador = {}
    utilizador = JSON.parse(localStorage.getItem("logged-user"))
    
    const navigate = useNavigate()
    // console.log(user)

    return utilizador ? children : <Navigate to="/login" />
}
