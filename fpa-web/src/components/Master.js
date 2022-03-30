import React, { useContext } from 'react';
import logo from '../assets/home-logo.jpg'
import '../styles/home.css'
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

import * as IoIcons from 'react-icons/io'

const Master = ({ children }) => {

  const { user } = useContext(UserAuthContext);
  const { logout } = useContext(UserAuthContext);


  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    // <Navigate to='/login' />
    navigate('/login')
    await logout()
  }

  return (
    <div className='main-home-container'>
      <header className='cabecalho'>
        <img className='cabecalho-logo' src={logo} alt='home logo' onClick={() => navigate('/')}></img>
        <span className='log-info-section'>
          <label className='cabecalho-loggedUser'>{user?.email}</label>
          {/* <button className='cabecalho-logout-btn' onClick={handleLogout}>Sair</button> */}
          <IoIcons.IoIosLogOut className='logout-icon' onClick={handleLogout} />
        </span>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Master