import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import { Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';

export default function ProtectedRoute({children}) {
    const { user } = useUserAuth()
    const navigate = useNavigate()

    return (
        !user ? (
            <Route path="login" element={<Login />}/>
            
        ) : (
            <Route path="/" element={<Home />}/>
        )
    )

    // useEffect(() => {
    //     if(user == null) {

    //         <Redirect />('login')
    //     }
    // }, []);

    // return children
}
