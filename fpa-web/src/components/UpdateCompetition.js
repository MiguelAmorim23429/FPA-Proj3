import { update, getDatabase, ref } from 'firebase/database';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateCompetition = () => {

    
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');

    const navigate = useNavigate()
    const { state } = useLocation()

    const { idComp, nomeComp, dataComp, localComp } = state

    const db = getDatabase()

    const atualizarCompeticao = () => {
        const id = idComp;
    
        const compData = {
          ativa: true,
          data: data,
          local: local,
          nome: nome,
        }
    
        const updates = {}
        updates['/competicoes/' + id] = compData
    
        update(ref(db), updates)
        navigate('/')
      }

    return (
        <div className='main-addcomp-container'>
            <form className='addcomp-form' onSubmit={atualizarCompeticao}>
                <input className='addcomp-input' type='text' placeholder='Nome' defaultValue={nomeComp} onChange={event => setNome(event.target.value)}></input>
                <input className='addcomp-input' type='text' placeholder='Data' defaultValue={dataComp} onChange={event => setData(event.target.value)}></input>
                <input className='addcomp-input' type='text' placeholder='Local' defaultValue={localComp} onChange={event => setLocal(event.target.value)}></input>
                <button className='addcomp-btn' type='submit'>Atualizar</button>
            </form>
        </div>
    )
};

export default UpdateCompetition;
