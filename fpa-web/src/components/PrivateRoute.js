import React, { useContext } from 'react';
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate, Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const { user } = useContext(UserAuthContext);
    const navigate = useNavigate()

    console.log(user)

    return user ? children : <Navigate to="/login" />
}
