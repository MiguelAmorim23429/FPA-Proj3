import React, { useContext, useState } from 'react';
import logo from '../assets/fpa-logo.png'
import './login.css'
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useContext(UserAuthContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            await login(email, password);
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='main-login-container'>
            <div className='login-container'>
                <img className='logo' src={logo} alt='login logo'></img>
                <h2>Inicie Sessão</h2>
                <form className='login-form' onSubmit={handleLogin}>
                    <input className='login-input' type='email' placeholder='Email' onChange={event => setEmail(event.target.value)}></input>
                    <input className='login-input' type='password' placeholder='Palavra-Passe' onChange={event => setPassword(event.target.value)}></input>
                    <button className='login-btn' type='submit'>Entrar</button>
                </form>
            </div>
        </div>
    )
}

export default Login