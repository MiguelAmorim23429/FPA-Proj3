import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetch'
import AddClub from './AddClub'
import '../styles/clubslist.css'

import * as IoIcons from 'react-icons/io'
import * as AiIcons from 'react-icons/ai'
import * as FaIcons from 'react-icons/fa'

const ClubsList = () => {

    const [athletes, clubs] = useFetch({ matchId: undefined, sportModalityId: undefined })

    const [showAddClubComponent, setShowAddClubComponent] = useState(false)
    const [sidebar, setSidebar] = useState(false);

    const showSideBar = () => { setSidebar(!sidebar) }
    const navigate = useNavigate()

    return (
        <div className={showAddClubComponent ? 'shadowed-container' : 'container'}>

            <div className={showAddClubComponent ? 'main-add-club-container' : 'hidden-main-add-club-container'}>
                <AddClub showAddClubComponent={showAddClubComponent} setShowAddClubComponent={setShowAddClubComponent} />
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

            <button className={showAddClubComponent ? 'shadowed-show-add-club-btn' : 'show-add-club-btn'} onClick={() => setShowAddClubComponent(true)}>Adicionar clube</button>

            <div className='club-headers'>
                <h4 className='club-line-header'>Nome</h4>
                <h4 className='club-line-header'>Sigla</h4>
            </div>

            <div className='clubs-list'>

                {clubs.map(([clubKey, club]) => {
                    console.log(club)
                    return (
                        <ul key={clubKey} className='club-line'>
                            <li className='club-line-item'>{club.nome}</li>
                            <li className='club-line-item'>{club.sigla}</li>
                        </ul>
                    )
                })}
            </div>
        </div>
    )
}

export default ClubsList