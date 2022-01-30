import React, { useState } from 'react';
import './addcomp.css'
import { getDatabase, ref, push } from "firebase/database"
import { useNavigate } from 'react-router-dom';

const AddAthlete = () => {

    const [clube, setClube] = useState('');
    const [dtNasc, setDtNasc] = useState('');
    const [escalao, setEscalao] = useState('');
    const [genero, setGenero] = useState('');
    const [nFederacao, setNFederacao] = useState('');
    const [nome, setNome] = useState('');

    const navigate = useNavigate()

    const db = getDatabase()
    
    const atletasRef = ref(db, '/atletas/')
    
    const adicionarAtleta = () => {
        
        const newAtletaRef = push(atletasRef, {
            clube: clube,
            dtNascimento: dtNasc,
            escalao: escalao,
            genero: genero,
            nFederacao: nFederacao,
            nome: nome,
        })

        const atletaId = newAtletaRef.key
        console.log(atletaId)
        navigate('/')
    }

    return (
        <div className='main-addcomp-container'>
            <form className='addcomp-form' onSubmit={adicionarAtleta}>
                <input className='addcomp-input' placeholder='Nome' onChange={event => setNome(event.target.value)}></input>
                <input className='addcomp-input' placeholder='Número Federação' onChange={event => setNFederacao(event.target.value)}></input>
                <input className='addcomp-input' placeholder='Clube' onChange={event => setClube(event.target.value)}></input>
                <input className='addcomp-input' placeholder='Data Nascimento' type='date' onChange={event => setDtNasc(event.target.value)}></input>
                <select onChange={event => setGenero(event.target.value)}>
                    <option className='select-default' value="0">Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>
                <select onChange={event => setEscalao(event.target.value)}>
                    <option className='select-default' value="0">Escalão</option>
                    <option value="INICIADOS">INICIADOS</option>
                    <option value="JUNIORES">JUNIORES</option>
                </select>
                <button className='addcomp-btn' type='submit'>Adicionar</button>
            </form>
        </div>
    )
};

export default AddAthlete;