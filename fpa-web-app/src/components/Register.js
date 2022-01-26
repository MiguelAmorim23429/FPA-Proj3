import React from 'react'
import '../styleAuth.css';
import logo from '../assets/fpa-logo.png'

export default function Register() {
    return (
        <div className='container'>
            <img className='logo' src={logo} alt='Logo FPA'>

            </img>
            <input className='input' type='email' placeholder='Email' ></input>
            <input className='input' type='password' placeholder='Palavra-Passe' ></input>
            <button className='btn'>Criar conta</button>
        </div>
    )
}
