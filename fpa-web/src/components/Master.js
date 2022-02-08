import React, { useContext } from 'react';
import logo from '../assets/home-logo.jpg'
import './home.css'
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

const Master = ({ children }) => {

  const { user } = useContext(UserAuthContext);
  const { logout } = useContext(UserAuthContext);


  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    // <Navigate to='/login' />
    navigate('/login')
    console.log(user.email)
    await logout()
  }

  return (
    <div className='main-home-container'>
      <header className='cabecalho'>
        <img className='cabecalho-logo' src={logo} alt='home logo' onClick={() => navigate('/')}></img>
        <span>
          <label className='cabecalho-loggedUser'>Sessão iniciada em: {user?.email}</label>
          <button className='cabecalho-logout-btn' onClick={handleLogout}>Sair</button>
        </span>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Master