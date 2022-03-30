import React, { useContext, useState } from 'react';
import logo from '../assets/fpa-logo.png'
import '../styles/login.css'
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { login } = useContext(UserAuthContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            await login(email, password);
            navigate('/')
        } catch (error) {
            switch(error.code) { // em caso de um erro no login, verifica qual é o código do erro e consoante esse codigo mostra uma mensagem de erro correspondente, (linha 49)
                case 'auth/invalid-email' : 
                    setError('Campos vazios')
                    break
                case 'auth/user-not-found' :
                    setError('E-mail introduzido errado ou não existe')
                    break
                case 'auth/wrong-password' :
                    setError('Palavra-passe errada')
                    break
                case 'auth/too-many-requests' :
                    setError('Falhou o inicio de sessão demasiadas vezes. Tente novamente mais tarde')
                    break
            }
                

            // setError(error.message)
            console.log(error)
        }
    }

    return (
        <div className='main-login-container'>
            <div className='login-container'>
                <img className='logo' src={logo} alt='login logo'></img>
                <h2 className='login-label'>Inicie Sessão</h2>
                {error && <h5 className='error-warning'>{error}</h5>}
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