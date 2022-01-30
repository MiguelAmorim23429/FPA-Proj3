import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase';

const UserAuthContext = createContext()

function AuthContextProvider({ children }) {

    const [user, setUser] = useState(auth.currentUser)

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    useEffect(() => {
        const authChange = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                console.log(`Logged in: ${currentUser.email}`)
            } else {
                setUser(currentUser)
                console.log(`Not logged in: ${currentUser.email}`)
            }

        })

        return () => {
            authChange()
        };
    }, []);


    return <UserAuthContext.Provider value={{ user, login, logout }}>{children}</UserAuthContext.Provider>
};

export { UserAuthContext }
export default AuthContextProvider
