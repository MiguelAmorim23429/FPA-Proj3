import React, { useState, useEffect, useRef } from 'react';
import { get, getDatabase, off, onValue, push, ref, set, update } from 'firebase/database';
import { useLocation } from 'react-router-dom';
import './participantsprova.css'

import * as IoIcons from 'react-icons/io'

const ParticipantsProva = () => {

    const { state } = useLocation()

    const { idProva } = state; // recebemos o valor do idProva que enviamos do ecrã das provas quando clicamos na prova

    const db = getDatabase()
    const participantesRef = ref(db, `/provas/${idProva}/participantes/`) // referência à base de dados para ir buscar os participantes da prova que clicamos
    const provaRef = ref(db, `/provas/${idProva}`) // referência à base de dados para ir buscar a prova que clicamos
    const atletasRef = ref(db, '/atletas') // referência à base de dados para ir buscar os atletas

    const [prova, setProva] = useState(null)
    const [{ inscritos, naoInscritos }, setAtletas] = useState({ inscritos: {}, naoInscritos: {} })

    const [indexBtn, setIndexBtn] = useState(-1);
    const mountedRef = useRef(false)

    const showButton = (index) => {
        setIndexBtn(index)
    }

    const hideButton = () => {
        setIndexBtn(-1)
    }

    const adicionarParticipante = async (atletaKey) => {

        const provasAtletaRef = ref(db, `/atletas/${atletaKey}/provas/${idProva}`)

        if (prova.estado == "emInscricoes") {
            await set(provasAtletaRef, true) // adicionar uma prova à lista de provas do atleta que escolhemos na lista

            await push(participantesRef, { // adicionar este atleta como participante da prova que clicamos anteriomente
                atleta: atletaKey
            })
        } else if(prova.estado == "ativa") {
            window.alert("Esta prova já está a decorrer. Não pode adicionar mais participantes.")
        } else if(prova.estado == "finalizada") {
            window.alert("Esta prova já terminou. Não pode adicionar mais participantes.")
        }
    }

    useEffect(() => {
        get(provaRef).then((snapshot) => { // Buscar a prova uma vez à base de dados
            setProva(snapshot.val())
        })
    }, [])

    useEffect(() => {

        const handler = async (snapshot) => {

            let atletasSnapshot = await get(atletasRef) // Buscar os atletas à base de dados

            let atletas = {}

            atletasSnapshot.forEach((childSnapshot) => { // Percorrer os atletas obtidos da BD, e inseri-los num objeto se o seu genero for igual ao genero da prova
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.genero == prova.genero) {
                    atletas[childKey] = childData
                }
            });

            let inscritos = {}
            let naoInscritos = {}

            snapshot.forEach((childSnapshot) => { // Percorrer os participantes obtidos da BD e inserir num objeto, as keys do atleta participante e a sua informação
                const atletaId = childSnapshot.val().atleta;
                inscritos[atletaId] = atletas[atletaId]
            });

            for (let atletaId of Object.keys(atletas)) { // Percorrer os id's dos atletas, se exister um atleta com id diferente desses, inserir esse atleta num objeto
                if (!inscritos[atletaId]) {
                    naoInscritos[atletaId] = atletas[atletaId]
                }
            }
            setAtletas({ inscritos, naoInscritos })
        }

        if (prova) {
            onValue(participantesRef, handler)
        }

        return (() => {
            if (prova) {
                off(handler)
            }
            // fetch()
        })
    }, [prova])

    const atualizarEstadoProva = () => {
        const updates = {}

        updates[`/provas/${idProva}/estado/`] = "ativa"

        update(ref(db), updates)
    }

    return (
        <div className='main-participantsprova-container'>
            <div className='start-btn-container'>
                <button className='start-test-btn' onClick={atualizarEstadoProva}>Começar prova</button>
            </div>
            <div className='lists-container'>
                <div className='main-participant-container'>
                    {Object.entries(naoInscritos).map(([key, value], index) => {

                        const generos = {
                            "Masculino": <IoIcons.IoMdMale size={20} color='#03A3FF' />,
                            "Feminino": <IoIcons.IoMdFemale size={20} color='#EC49A7' />,
                        }

                        return (
                            <div key={key} className='participant-container'
                                onMouseEnter={() => showButton(index)} // quando metemos o rato por cima atribui este index à variável "indexBtn"
                                onMouseLeave={hideButton}>
                                <ul className='participant-list'>
                                    <li className='participant-list-item'>{value.nome}</li>
                                    <li className='participant-list-item'>{generos[value.genero]}</li>
                                    <li className='participant-list-item'>{value.escalao}</li>
                                    <li className='participant-list-item'>{value.clube}</li>
                                </ul>
                                <div className='participant-list-btn-container'>
                                    <button className={indexBtn === index ? 'prova-btn-show' : 'prova-btn-hide'} id='goto-participants-btn' onClick={() => adicionarParticipante(key)}>Adicionar</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='main-participant-container'>
                    {Object.entries(inscritos).map(([key, atleta]) => {
                        return (
                            <div key={key} className='participant-container'>
                                <ul className='participant-list'>
                                    <li className='participant-list-item'>{atleta.nome}</li>
                                    <li className='participant-list-item'>{atleta.genero}</li>
                                    <li className='participant-list-item'>{atleta.escalao}</li>
                                    <li className='participant-list-item'>{atleta.clube}</li>
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

export default ParticipantsProva;
