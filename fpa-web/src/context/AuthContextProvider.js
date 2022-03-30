import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase';

const UserAuthContext = createContext()

function AuthContextProvider({ children }) {

    const [user, setUser] = useState(auth.currentUser)

    const [idComp, setIdComp] = useState(null)
    const [nameComp, setNameComp] = useState(null)
    const [dateComp, setDateComp] = useState(null)
    const [locationComp, setLocationComp] = useState(null)
    const [photoComp, setPhotoComp] = useState(null)

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    useEffect(() => {
        const authChange = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            localStorage.setItem("logged-user", JSON.stringify(currentUser)) // guardar user em local storage
            console.log(currentUser)
        })

        return () => {
            authChange()
        };
    }, []);


    return <UserAuthContext.Provider value={{ user,
         login,
         logout,
         idComp,
         setIdComp,
         nameComp,
         setNameComp,
         dateComp,
         setDateComp,
         locationComp,
         setLocationComp,
         photoComp,
         setPhotoComp }}>{children}
         </UserAuthContext.Provider>
};

export { UserAuthContext }
export default AuthContextProvider
