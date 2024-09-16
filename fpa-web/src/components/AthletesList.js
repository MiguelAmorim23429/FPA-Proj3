import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetch'

import * as IoIcons from 'react-icons/io'
import * as AiIcons from 'react-icons/ai'
import * as FaIcons from 'react-icons/fa'

import '../styles/athleteslist.css'
import AddAthlete from './AddAthlete'

function AthletesList() {

    const [athletes] = useFetch({ matchId: undefined, sportModalityId: undefined })

    const [showAddAthleteComponent, setShowAddAthleteComponent] = useState(false)
    const [sidebar, setSidebar] = useState(false);

    const showSideBar = () => { setSidebar(!sidebar) }
    const navigate = useNavigate()

    return (
        <div className={showAddAthleteComponent ? 'shadowed-container' : 'container'}>

            <div className={showAddAthleteComponent ? 'main-add-athlete-container' : 'hidden-main-add-athlete-container'}>
                <AddAthlete showAddAthleteComponent={showAddAthleteComponent} setShowAddAthleteComponent={setShowAddAthleteComponent} />
            </div>

            <div>
                <FaIcons.FaBars className='side-bar-openbtn' onClick={showSideBar} />
                <nav className={sidebar ? 'side-bar-show' : 'side-bar-hide'}>
                    <ul className='side-bar-menu-times'>
                        <li>
                            <AiIcons.AiOutlineClose className='side-bar-closebtn' onClick={showSideBar} />
                        </li>
                        <li>
                            <button className='side-bar-btn' onClick={() => navigate('/atletas')}>Atletas</button>
                        </li>
                        <li>
                            <button className='side-bar-btn' onClick={() => navigate('/gestores')}>Gestores</button>
                        </li>
                        <li>
                            <button className='side-bar-btn' onClick={() => navigate('/clubes')}>Clubes</button>
                        </li>
                    </ul>
                </nav>
            </div>

            <button className={showAddAthleteComponent ? 'shadowed-show-add-athlete-btn' : 'show-add-athlete-btn'} onClick={() => setShowAddAthleteComponent(true)}>Adicionar atleta</button>

            <div className='athlete-headers'>
                <h4 className='athlete-line-header'>Nome</h4>
                <h4 className='athlete-line-header'>Género</h4>
                <h4 className='athlete-line-header'>Escalão</h4>
                <h4 className='athlete-line-header'>Clube</h4>
            </div>

            <div className='athletes-list'>

                {athletes.map(([athleteKey, athlete]) => {
                    const genders = {
                        "Masculino": <IoIcons.IoMdMale size={20} color={showAddAthleteComponent ? 'rgba(3, 163, 255, 0.5)' : '#03A3FF'} />,
                        "Feminino": <IoIcons.IoMdFemale size={20} color={showAddAthleteComponent ? 'rgba(236, 73, 167, 0.5)' : '#EC49A7'} />,
                    }

                    return (
                        <ul key={athleteKey} className='athlete-line'>
                            <li className='athlete-line-item'>{athlete.nome}</li>
                            <li className='athlete-line-item'>{genders[athlete.genero]}</li>
                            <li className='athlete-line-item'>{athlete.escalao}</li>
                            <li className='athlete-line-item'>{athlete.clube.sigla}</li>
                        </ul>
                    )
                })}
            </div>
        </div>
    )
}

export default AthletesList