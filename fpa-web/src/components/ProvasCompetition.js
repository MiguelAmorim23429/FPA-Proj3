import { equalTo, getDatabase, off, onValue, orderByChild, push, query, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './provascomp.css'

import * as IoIcons from 'react-icons/io'

const ProvasCompetition = () => {

    const navigate = useNavigate()
    const { state } = useLocation()

    const { idComp } = state; // recebemos o valor do idComp que enviamos do ecrã das competições quando clicamos na competição

    const [hora, setHora] = useState('')
    const [nome, setNome] = useState('')
    const [categoria, setCategoria] = useState('')
    const [genero, setGenero] = useState('');
    const [modalidade, setModalidade] = useState('');
    const [escalao, setEscalao] = useState('');

    const [indexBtn, setIndexBtn] = useState(-1);

    const db = getDatabase();
    const provasRef = ref(db, '/provas/') // referência à base de dados para depois adicionar provas novas
    const provasCompRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idComp))
    const modalidadesRef = ref(db, '/modalidades/') // referência à base de dados para ir buscar as modalidades

    const [prova, setProva] = useState([])
    const [modalidades, setModalidades] = useState([])

    const showButton = (index) => {
        console.log(index)
        setIndexBtn(index)
    }

    const hideButton = () => {
        setIndexBtn(-1)
    }

    useEffect(() => {

        const handler = (snapshot) => {
            let provas = []

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                provas.push([childKey, childData])
            });
            setProva(provas)
        }

        // Busca das provas existentes na competicao que selecionamos no ecrã anterior
        onValue(provasCompRef, handler)

        return(() => {
            off(handler)
        })
    }, [])

    useEffect(() => {

        const handler = (snapshot) => {
            let modalidadesArray = []

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                modalidadesArray.push([childKey, childData])
            });
            setModalidades(modalidadesArray)
            console.log(modalidadesArray)
        }

        onValue(modalidadesRef, handler)

        return (() => {
            off(handler)
        })
    }, []);

    const deleteProva = (key) => { // so altera o estado, não apaga realmente da base de dados
        const idProva = key;

        const updates = {}
        updates[`/provas/${idProva}/ativa`] = false

        update(ref(db), updates)
    }

    const adicionarProva = () => { // função para criar uma nova função com os dados inseridos nos inputs do ecrã

        const newProvaRef = push(provasRef, { // a função push do firebase cria um id novo automaticamente 
            categoria: categoria,
            competicao: idComp,
            escalao: escalao,
            genero: genero,
            hora: hora,
            modalidade: modalidade,
            nome: nome,
            estado: "emInscricoes"
        })

        const provaId = newProvaRef.key
        console.log(provaId)
        navigate('/')
    }

    const goToParticipantsProva = (key) => {  // função redireciona para o ecrã dos participantes desta prova, e envia o id da prova para esse ecrã
        const idProva = key;
        navigate('/participantes', { state: { idProva } })
    }

    return (
        prova.length == 0 ? ( // se não existirem provas na competição, mostra um quando com o text das linhas 112 e 114. se tiver provas são listadas
            <div className='main-provascomp-container'>
                <div className='main-prova-container'>
                    <div className='prova-container' style={{ justifyContent: 'center', alignItems: 'center', height: '180px' }}>
                        <p>
                            Competição sem provas programadas.
                            <br />
                            Adicione Provas
                        </p>
                    </div>
                </div>
                <div className='update-prova-container'>
                    <form className='addprova-form' onSubmit={adicionarProva}>
                        <input className='addprova-input' placeholder="Hora" onChange={event => setHora(event.target.value)}></input>
                        <input className='addprova-input' placeholder="Nome" onChange={event => setNome(event.target.value)}></input>
                        <input className='addprova-input' placeholder="Categoria" onChange={event => setCategoria(event.target.value)}></input>
                        <div className='select-box-container'>
                            <select className='info-prova-select-box' onChange={event => setGenero(event.target.value)}>
                                <option className='select-default' value="0">Género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                            <select className='info-prova-select-box' onChange={event => setModalidade(event.target.value)}>
                                <option className='select-default' value="0">Modalidade</option>
                                {modalidades.map(([key, value]) => {
                                    return (
                                        <option key={key} value={key}>{value.nome}</option>
                                    )
                                })}
                            </select>
                            <select className='info-prova-select-box' onChange={event => setEscalao(event.target.value)}>
                                <option className='select-default' value="0">Escalão</option>
                                <option value="INICIADOS">INICIADOS</option>
                                <option value="JUNIORES">JUNIORES</option>
                            </select>
                        </div>
                        <button className='addprova-btn' type='submit'>Adicionar</button>
                    </form>


                </div>
            </div>
        ) : (
            <div className='main-provascomp-container'>
                <div className='main-prova-container'>
                    {prova.map(([key, value], index) => { // fazemos map do array prova para um array com a chave da prova, os seus dados e index

                        const generos = {
                            "Masculino": <IoIcons.IoMdMale size={20} color='#03A3FF' />,
                            "Feminino": <IoIcons.IoMdFemale size={20} color='#EC49A7' />,
                        }
                        return (
                            // <div >
                            <div key={key} className='prova-container'
                                onMouseEnter={() => showButton(index)}
                                onMouseLeave={hideButton}>
                                <ul className='prova-list'>
                                    <li className='prova-list-item'>{value.hora}</li>
                                    <li className='prova-list-item'>{value.nome}</li>
                                    <li className='prova-list-item'>{value.escalao}</li>
                                    <li className='prova-list-item'>{generos[value.genero]}</li>
                                </ul>
                                <div className='prova-list-btn-container'>
                                    <button className={indexBtn == index ? 'prova-btn-show' : 'prova-btn-hide'} id='goto-participants-btn' onClick={() => goToParticipantsProva(key)}>Participantes</button>
                                    <button className={indexBtn == index ? 'prova-btn-show' : 'prova-btn-hide'} id='apagar-prova-btn' onClick={() => window.confirm("Deseja mesmo remover?") && deleteProva(key)}>Remover</button>
                                </div>
                            </div>
                            // </div>
                        )

                    })}
                </div>
                <div className='update-prova-container'>
                    <form className='addprova-form' onSubmit={adicionarProva}>
                        <input className='addprova-input' placeholder="Hora" onChange={event => setHora(event.target.value)}></input>
                        <input className='addprova-input' placeholder="Nome" onChange={event => setNome(event.target.value)}></input>
                        <input className='addprova-input' placeholder="Categoria" onChange={event => setCategoria(event.target.value)}></input>
                        <div className='select-box-container'>
                            <select className='info-prova-select-box' onChange={event => setGenero(event.target.value)}>
                                <option className='select-default' value="0">Género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                            <select className='info-prova-select-box' onChange={event => setModalidade(event.target.value)}>
                                <option className='select-default' value="0">Modalidade</option>
                                {modalidades.map(([key, value]) => {
                                    return (
                                        <option key={key} value={key}>{value.nome}</option>
                                    )
                                })}
                            </select>
                            <select className='info-prova-select-box' onChange={event => setEscalao(event.target.value)}>
                                <option className='select-default' value="0">Escalão</option>
                                <option value="INICIADOS">INICIADOS</option>
                                <option value="JUNIORES">JUNIORES</option>
                            </select>
                        </div>
                        <button className='addprova-btn' type='submit'>Adicionar</button>
                    </form>
                </div>
            </div>
        )

    )
};

export default ProvasCompetition;
