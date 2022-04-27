import React, { useState, useEffect } from 'react'

import { ref, getDatabase, push } from 'firebase/database';

import '../styles/addclub.css'

function AddClub() {

    const [name, setName] = useState('');
    const [initials, setInitials] = useState('');

    const db = getDatabase()
    const clubsRef = ref(db, '/clubes/')

    const addClub = (e) => {
        e.preventDefault();

        const newClubRef = push(clubsRef, {
            nome: name,
            sigla: initials,
        })

        const provaId = newClubRef.key

        setName('')
        setInitials('')
    }

    return (
        <div className='main-add-club-container'>

            <h1 className='add-info-page-title'>Adicionar um clube</h1>
            <form className='add-club-form' onSubmit={addClub}>

                <div className='add-club-input-container'>
                    <div className='input-value-box'>
                        <label className='add-club-label'>Nome</label>
                        <input className='add-club-input' placeholder='Clube' type='text' value={name}
                            onChange={event => setName(event.target.value)}></input>
                    </div>

                    {/* <div className='input-validation-box'>
                        <label className='validation-label'></label>
                    </div> */}
                </div>

                <div className='add-club-input-container'>
                    <div className='input-value-box'>
                        <label className='add-club-label'>Sigla</label>
                        <input className='add-club-input' placeholder='Sigla' type='text' value={initials}
                            onChange={event => setInitials(event.target.value)}></input>
                    </div>

                    {/* <div className='input-validation-box'>
                        <label className='validation-label'></label>
                    </div> */}
                </div>

                <button className='add-new-club-btn' type='submit'>Adicionar</button>

            </form>
        </div>
    )
}

export default AddClub