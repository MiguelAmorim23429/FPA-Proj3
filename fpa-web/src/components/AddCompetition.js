import React, { useState } from 'react';
import './addcomp.css'
import { getDatabase, ref, push } from "firebase/database"
import { useNavigate } from 'react-router-dom';

const AddCompetition = () => {

    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');

    const navigate = useNavigate()

    const db = getDatabase()
    
    const competicoesRef = ref(db, '/competicoes/')
    
    const adicionarCompeticao = () => {
        
        const newCompRef = push(competicoesRef, {
            nome: nome,
            data: data,
            local: local,
            ativa: true
        })

        const compId = newCompRef.key
        console.log(compId)
        navigate('/')
    }

    // const adicionarCompeticao = () => {
    //     const newCompRef = competicoesRef.push({
    //         ativa: 'true',
    //         data: data,
    //         local: local,
    //         nome: nome
    //     })
    
    //     const compId = newCompRef.key
    // }
    

    return (
        <div className='main-addcomp-container'>
            <form className='addcomp-form' onSubmit={adicionarCompeticao}>
                <input className='addcomp-input' type='text' placeholder='Nome' onChange={event => setNome(event.target.value)}></input>
                <input className='addcomp-input' type='text' placeholder='Data' onChange={event => setData(event.target.value)}></input>
                <input className='addcomp-input' type='text' placeholder='Local' onChange={event => setLocal(event.target.value)}></input>
                <button className='addcomp-btn' type='submit'>Adicionar</button>
            </form>
        </div>
    )
}

export default AddCompetition
