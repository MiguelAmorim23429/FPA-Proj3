import React, { useState } from 'react'
import '../styleAuth.css';
import logo from '../assets/fpa-logo.png'
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useUserAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            console.log('XXXXXXXXXXXXX')
            await login(email, password)
            navigate('/', { replace: true })
        } catch (error) {
            console.log('CCCCCCCCCCCCC')
            console.log(error)
        }
    }

    return (
        <div className='container-login'>
            <div className='main-container'>
                <img className='logo' src={logo} alt='Logo FPA'>

                </img>

                <h2 className='label'>Inicie sessão</h2>
                <form className='form' onSubmit={() => handleLogin}>
                    <input className='input' type='email' placeholder='Email' onChange={event => setEmail(event.target.value)}></input>
                    <input className='input' type='password' placeholder='Palavra-Passe' onChange={event => setPassword(event.target.value)}></input>
                    <button className='btn' type='submit'>Entrar</button>
                </form>
                
            </div>
        </div>
    )
}
