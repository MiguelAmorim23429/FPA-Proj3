import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase'

const userAuthContext = createContext()

export function UserAuthContextProvider({children}) {

    const [user, setUser] = useState(null)

    function login(email, password) {
        console.log('AAAAAAAAAAAAAA')
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        console.log('MACACOOOOOOOOOOOOO')
        return auth.signOut()
    }

    useEffect(() => {
        const authChange = onAuthStateChanged(auth, (currentUser) => {
            console.log("XXXX")
            console.log(currentUser.email)
            setUser(currentUser)
            console.log(currentUser.email)
        })
        return () => {
            authChange()
        }
    }, [])

    return <userAuthContext.Provider value={{user, login, logout}}>{children}</userAuthContext.Provider>
}

export function useUserAuth() {
    console.log('batatas')
    return useContext(userAuthContext)
}