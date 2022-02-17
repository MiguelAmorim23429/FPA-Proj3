import React, { useState } from 'react'
import './addmanager.css'
import { getDatabase, ref, push, set, child } from "firebase/database"
import { useNavigate } from 'react-router-dom';
import { authRegister } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AddManagers = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    const db = getDatabase()

    const adicionarGestor = () => {
        let userId
        createUserWithEmailAndPassword(authRegister, email, password)
            .then((credentials) => {
                userId = credentials.user.uid

                const managersRef = ref(db, `/users/${userId}`)

                const user = {
                    autorizado: false,
                    email: email,
                    password: password,
                    username: username,
                }

                set(managersRef, user)
            })
        navigate('/')
    }

    return (
        <div className='main-addmanager-container'>
            <form className='addmanager-form' onSubmit={adicionarGestor}>
                <input className='addmanager-input' type='text' placeholder='Nome de Utilizador' onChange={event => setUsername(event.target.value)}></input>
                <input className='addmanager-input' type='email' placeholder='Email' onChange={event => setEmail(event.target.value)}></input>
                <input className='addmanager-input' type='password' placeholder='Palavra-Passe' onChange={event => setPassword(event.target.value)}></input>
                <button className='addmanager-btn' type='submit'>Adicionar</button>
            </form>
        </div>
    )
}

export default AddManagers