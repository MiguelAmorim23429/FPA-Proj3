import React from 'react'
import '../home.css';
import homeLogo from '../assets/home-logo.jpg'
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const { user } = useUserAuth()
    const { logout } = useUserAuth()
    const navigate = useNavigate()
    console.log(user)

    const handleLogout = async (e) => {
        // e.preventDefault()
        navigate('login', { replace: true })
        await logout()
    }

    return (
        <div className='container'>
            <header className='cabecalho'>
                <img className='home-logo' src={homeLogo} alt='Logo Home'></img>
                <span>
                    <label className='logged-user-label'>Sessão iniciada em: {user.email}</label>
                    {/* <form onSubmit={handleLogout}> */}
                        <button className='logout-btn' onClick={handleLogout}>Sair</button>
                    {/* </form> */}
                </span>
            </header>
        </div>
    )
}
