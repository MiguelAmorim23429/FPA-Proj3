import React, { useState, useEffect } from 'react'

import useFetch from '../hooks/useFetch'

import * as IoIcons from 'react-icons/io'

import '../styles/athleteslist.css'
import AddAthlete from './AddAthlete'

function AthletesList() {

    const [athletes] = useFetch({ matchId: undefined, sportModalityId: undefined })

    const [showAddAthleteComponent, setShowAddAthleteComponent] = useState(false)

    return (
        <div className={showAddAthleteComponent ? 'shadowed-container' : 'container'}>

            <div className={showAddAthleteComponent ? 'main-add-athlete-container' : 'hidden-main-add-athlete-container'}>
                <AddAthlete showAddAthleteComponent={showAddAthleteComponent} setShowAddAthleteComponent={setShowAddAthleteComponent} />
            </div>
            {/* {showAddAthleteComponent && <AddAthlete showAddAthleteComponent={showAddAthleteComponent} setShowAddAthleteComponent={setShowAddAthleteComponent} />} */}

            <button className={showAddAthleteComponent ? 'shadowed-add-athlete-btn' : 'add-athlete-btn'} onClick={() => setShowAddAthleteComponent(true)}>Adicionar atleta</button>

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