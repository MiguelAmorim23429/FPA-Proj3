import React, { useState, useEffect } from 'react';
import { get, getDatabase, off, onValue, push, ref, remove, set, update } from 'firebase/database';
import { useLocation } from 'react-router-dom';
import '../styles/participantsprova.css'

import * as IoIcons from 'react-icons/io'

const ParticipantsProva = () => {

    const { state } = useLocation();

    const { idMatch } = state; // recebemos o valor do idProva que enviamos do ecrã das provas quando clicamos na prova

    const db = getDatabase();
    const participantsRef = ref(db, `/provas/${idMatch}/participantes/`); // referência à base de dados para ir buscar os participantes da prova que clicamos
    const matchRef = ref(db, `/provas/${idMatch}`); // referência à base de dados para ir buscar a prova que clicamos
    const athletesRef = ref(db, '/atletas'); // referência à base de dados para ir buscar os atletas
    const clubsRef = ref(db, '/clubes/');

    const [match, setMatch] = useState(null)
    const [{ enrolled, notEnrolled }, setAthletes] = useState({ enrolled: {}, notEnrolled: {} })
    const [indexBtn, setIndexBtn] = useState(-1);

    const showButton = (index) => {
        setIndexBtn(index)
    }

    const hideButton = () => {
        setIndexBtn(-1)
    }

    const addParticipant = async (athleteKey) => {

        const athleteMatchesRef = ref(db, `/atletas/${athleteKey}/provas/${idMatch}`)

        if (match.estado === "emInscricoes") {
            await set(athleteMatchesRef, true) // adicionar uma prova à lista de provas do atleta que escolhemos na lista

            await push(participantsRef, { // adicionar este atleta como participante da prova que clicamos anteriomente
                atleta: athleteKey
            })
        } else if (match.estado === "ativa") {
            window.alert("Esta prova já está a decorrer. Não pode adicionar mais participantes.")
        } else if (match.estado === "finalizada") {
            window.alert("Esta prova já terminou. Não pode adicionar mais participantes.")
        }
    }

    const removeParticipant = async (athleteKey, participantKey) => {

        const athleteMatchesRef = ref(db, `/atletas/${athleteKey}/provas/${idMatch}`)

        const participantToRemoveRef = ref(db, `/provas/${idMatch}/participantes/${participantKey}`)

        if (match.estado === "emInscricoes") {
            await remove(athleteMatchesRef)
            await remove(participantToRemoveRef)
            console.log("REMOVEU", participantKey)
        } else {
            alert("Já não é possível remover participantes.")
        }
    }

    useEffect(() => {
        const handlerMatch = (snapshot) => {
            const matchObj = snapshot.val()
            setMatch(matchObj)

        }

        const fetchMatch = onValue(matchRef, handlerMatch)
        // onValue(matchRef, handlerMatch)

        return (() => {
            fetchMatch()
        })

    }, [])

    useEffect(() => {

        const handler = async (snapshot) => {
            let athletesSnapshot = await get(athletesRef); // Buscar os atletas à base de dados
            let clubsSnapshot = await get(clubsRef);

            let athletes = {}
            let clubs = {}

            clubsSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                clubs[childKey] = childData;
            })

            athletesSnapshot.forEach((childSnapshot) => { // Percorrer os atletas obtidos da BD, e inseri-los num objeto se o seu genero for igual ao genero da prova
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.genero === match.genero && childData.escalao === match.escalao) {
                    athletes[childKey] = childData;
                    athletes[childKey].clube = clubs[childData.clube];
                }

                // athletes[childKey].clube = clubs[childData.clube].sigla;
            });

            let enrolled = {}
            let notEnrolled = {}

            snapshot.forEach((childSnapshot) => { // Percorrer os participantes obtidos da BD e inserir num objeto, as keys do atleta participante e a sua informação
                const athleteId = childSnapshot.val().atleta;
                const participantKey = childSnapshot.key
                // enrolled.idParticipante = participantId
                enrolled[athleteId] = {
                    participantKey: participantKey,
                    athlete: athletes[athleteId]
                }
            });

            // console.log("aa", enrolled, "xx")

            for (let athleteId of Object.keys(athletes)) { // Percorrer os id's dos atletas, se exister um atleta com id diferente desses, inserir esse atleta num objeto
                if (!enrolled[athleteId]) {
                    notEnrolled[athleteId] = athletes[athleteId]
                }
            }
            setAthletes({ enrolled, notEnrolled })
        }

        const closeParticipantsOnvalue = match && onValue(participantsRef, handler)

        return (() => {
            match && closeParticipantsOnvalue()
        })

    }, [match])

    const updateMatchState = () => {

        const updates = {}

        updates[`/provas/${idMatch}/estado/`] = "ativa"

        if (match.estado === 'emInscricoes' && Object.entries(enrolled).length !== 0) {
            update(ref(db), updates)
        }
        if (match.estado === 'ativa') {
            window.alert("Esta prova já está a decorrer.")
        }
        if (match.estado === 'finalizada') {
            window.alert("Esta prova já terminou.")
        }
        if (Object.entries(enrolled).length === 0) {
            window.alert("Tem de adicionar pelo menos um atleta para iniciar a prova.")
        }

        // if (match.estado === 'emInscricoes' && Object.entries(enrolled).length !== 0) {
        //     update(ref(db), updates)
        // } else if (match.estado === 'ativa') {
        //     window.alert("Esta prova já está a decorrer.")
        // } else if (match.estado === 'finalizada') {
        //     window.alert("Esta prova já terminou.")
        // } else if (Object.entries(enrolled).length === 0) {
        //     window.alert("Tem de adicionar pelo menos um atleta para iniciar a prova.")
        // }

    }

    const renderMatchStatusText = () => {

        let statusText
        if (match) {
            if (match.estado === 'emInscricoes') {
                statusText = <p className='match-status-text'>Em fase de inscrições</p>
            } else if (match.estado === 'ativa') {
                statusText = <p className='match-status-text'>Prova a decorrer</p>
            } else if (match.estado === 'finalizada') {
                statusText = <p className='match-status-text'>Prova terminada</p>
            }
        }

        return statusText
    }

    return (
        <div className='main-participantsprova-container'>
            <div className='start-btn-container'>
                <button className='start-test-btn' onClick={updateMatchState}>Iniciar prova</button>

                {renderMatchStatusText()}

                <p className='match-status-text'></p>
            </div>
            <div className='lists-container'>
                <div className='main-participant-container'>

                    <h2>Não inscritos</h2>

                    {Object.entries(notEnrolled).map(([key, value], indexEnrolled) => {
                        const genders = {
                            "Masculino": <IoIcons.IoMdMale size={20} color='#03A3FF' />,
                            "Feminino": <IoIcons.IoMdFemale size={20} color='#EC49A7' />,
                        }

                        return (
                            <div key={key} className='participant-container'
                                onMouseEnter={() => showButton(indexEnrolled)} // quando metemos o rato por cima atribui este index à variável "indexBtn"
                                onMouseLeave={hideButton}>
                                <ul className='participant-list'>
                                    <li className='participant-list-item'>{value.nome}</li>
                                    <li className='participant-list-item'>{genders[value.genero]}</li>
                                    <li className='participant-list-item'>{value.escalao}</li>
                                    <li className='participant-list-item'>{value.clube.sigla}</li>
                                </ul>
                                <div className='participant-list-btn-container'>
                                    <button className={indexBtn === indexEnrolled ? 'prova-btn-show' : 'prova-btn-hide'} id='goto-participants-btn' onClick={() => addParticipant(key)}>Adicionar</button>
                                </div>
                            </div>

                        )
                    })}
                </div>
                <div className='main-participant-container'>

                    <h2>Inscritos</h2>

                    {Object.entries(enrolled).map(([athleteKey, participant], index) => {
                        const genders = {
                            "Masculino": <IoIcons.IoMdMale size={20} color='#03A3FF' />,
                            "Feminino": <IoIcons.IoMdFemale size={20} color='#EC49A7' />,
                        }

                        return (
                            <div key={athleteKey} className='participant-container'
                                onMouseEnter={() => showButton(index + "a")} // quando metemos o rato por cima atribui este index à variável "indexBtn"
                                onMouseLeave={hideButton}>
                                <ul className='participant-list'>
                                    <li className='participant-list-item'>{participant.athlete.nome}</li>
                                    <li className='participant-list-item'>{genders[participant.athlete.genero]}</li>
                                    <li className='participant-list-item'>{participant.athlete.escalao}</li>
                                    <li className='participant-list-item'>{participant.athlete.clube.sigla}</li>
                                </ul>
                                <div className='participant-list-btn-container'>
                                    <button className={indexBtn === index + "a" ? 'prova-btn-show' : 'prova-btn-hide'} id='remove-participant-btn' onClick={() => removeParticipant(athleteKey, participant.participantKey)}>Remover</button>
                                </div>
                            </div>

                        )
                    })}
                </div>
            </div>
        </div >
    )
};

export default ParticipantsProva;
