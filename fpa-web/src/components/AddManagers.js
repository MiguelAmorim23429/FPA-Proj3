import React, { useState, useEffect } from 'react'
import '../styles/addmanager.css'
import { getDatabase, ref, set } from "firebase/database"
import { useNavigate } from 'react-router-dom';
import { authRegister } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const AddManagers = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    const [timer, setTimer] = useState(null)

    const [errors, setErrors] = useState({
        username: {
            valid: false,
            message: '',
        },
        email: {
            valid: false,
            message: '',
        },
        password: {
            valid: false,
            message: '',
        },
    })

    const db = getDatabase()

    useEffect(() => {

        const emptyString = ''

        console.log(username)
        console.log(email)
        console.log(password)

        clearTimeout(timer)

        setTimer(
            setTimeout(() => {
                if (username === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        username: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else if (username.length < 6) {
                    setErrors(prevState => ({
                        ...prevState,
                        username: {
                            valid: false,
                            message: 'O nome tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        username: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                }
                if (email === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        email: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else if (email.length < 6) {
                    setErrors(prevState => ({
                        ...prevState,
                        email: {
                            valid: false,
                            message: 'O email tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        email: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                }
                if (password === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        password: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else if (!/[A-Z]/.test(password)) {
                    setErrors(prevState => ({
                        ...prevState,
                        password: {
                            valid: false,
                            message: 'A palavra-passe tem de ter pelo menos uma letra maiúscula.',
                        }
                    }))
                } else if (password.length < 6) {
                    setErrors(prevState => ({
                        ...prevState,
                        password: {
                            valid: false,
                            message: 'A palavra-passe tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        password: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                }

            }, 500)
        )
    }, [username, email, password]);

    const addManager = () => {
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
        <div className='main-add-manager-container'>
            <form className='add-manager-form' onSubmit={addManager}>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Nome</label>
                        <input className='update-comp-input' placeholder='Nome de Utilizador' type='text' value={username}
                            onChange={event => setUsername(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>aaa</label> */}
                        <label className='validation-label'>{!errors.username.valid && errors.username.message}</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Email</label>
                        <input className='update-comp-input' placeholder='Email' type='email' value={email}
                            onChange={event => setEmail(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>aaa</label> */}
                        <label className='validation-label'>{!errors.email.valid && errors.email.message}</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Password</label>
                        <input className='update-comp-input' placeholder='Palavra-Passe' type='password' value={password}
                            onChange={event => setPassword(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>aaa</label> */}
                        <label className='validation-label'>{!errors.password.valid && errors.password.message}</label>
                    </div>

                </div>
                <button className='add-manager-btn' type='submit'>Adicionar</button>
            </form>
        </div>
    )
}

export default AddManagers