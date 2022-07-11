import React, { useState, useEffect } from 'react';
import '../styles/addcomp.css'
import { getDatabase, ref, push } from "firebase/database"
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { uploadBytes, ref as sref, getDownloadURL } from 'firebase/storage';

import * as AiIcons from 'react-icons/ai'

const AddCompetition = (props) => {

    const { showAddCompetitionComponent, setShowAddCompetitionComponent } = props

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [selectedFile, setSelectedFile] = useState(null)

    const navigate = useNavigate()

    const db = getDatabase()

    const [timer, setTimer] = useState(null)

    const [errors, setErrors] = useState({
        name: {
            valid: false,
            message: '',
        },
        date: {
            valid: false,
            message: '',
        },
        location: {
            valid: false,
            message: '',
        },
    })

    const competicoesRef = ref(db, '/competicoes/')

    const adicionarCompeticao = () => {
        let imagesRef
        if (selectedFile) {
            imagesRef = sref(storage, `/images/${selectedFile.name}`);
        }


        uploadBytes(imagesRef, selectedFile)
            .then(() => {
                getDownloadURL(imagesRef)
                    .then((url) => {
                        const newCompRef = push(competicoesRef, {
                            nome: name,
                            data: date,
                            local: location,
                            ativa: true,
                            foto: url,
                        })
                    })
            })

        navigate('/')
    }

    const handleSubmit = (e) => {
        if (errors.name.valid && errors.date.valid && errors.location.valid) {
            e.preventDefault();
            adicionarCompeticao();
            console.log("submeteu");
        } else {
            e.preventDefault();
            console.log("ADSAD")
            return false
        }
    }

    useEffect(() => {

        clearTimeout(timer)

        setTimer(
            setTimeout(() => {
                if (name === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        name: {
                            valid: false,
                            message: '',
                        }
                    }))
                } else {
                    if (name.length < 6) {
                        setErrors(prevState => ({
                            ...prevState,
                            name: {
                                valid: false,
                                message: 'O nome tem de ter pelo menos 6 caracteres.',
                            }
                        }))
                    } else {
                        setErrors(prevState => ({
                            ...prevState,
                            name: {
                                valid: true,
                                message: '',
                            }
                        }))
                    }
                }

                if (date === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        date: {
                            valid: false,
                            message: '',
                        }
                    }))
                } else {

                    let competitionChoosenStartDate = new Date(date)

                    console.log(competitionChoosenStartDate)

                    if (competitionChoosenStartDate < Date.now()) {
                        setErrors(prevState => ({
                            ...prevState,
                            date: {
                                valid: false,
                                message: 'A data tem de ser posterior à data de hoje.',
                            }
                        }))
                    } else {
                        setErrors(prevState => ({
                            ...prevState,
                            date: {
                                valid: true,
                                message: '',
                            }
                        }))
                    }
                    // setErrors(prevState => ({
                    //     ...prevState,
                    //     date: {
                    //         valid: true,
                    //         message: '',
                    //     }
                    // }))
                }
                if (location === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: false,
                            message: '',
                        }
                    }))
                } else if (location.length < 6) {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: false,
                            message: 'O local tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: true,
                            message: '',
                        }
                    }))
                }

            }, 500)
        )
    }, [name, date, location]);

    return (
        <div className='main-add-comp-container'>
            <AiIcons.AiOutlineClose className='form-closebtn' onClick={() => setShowAddCompetitionComponent(false)} />
            <form className='add-comp-form' onSubmit={handleSubmit}>

                <div className='add-comp-input-container'>
                    <div className='input-value-box'>
                        <label className='add-comp-label'>Nome</label>
                        <input className='add-comp-input' type='text' value={name}
                            onChange={event => setName(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        <label className='validation-label'>{!errors.name.valid && errors.name.message}</label>
                    </div>

                </div>

                <div className='add-comp-input-container'>
                    <div className='input-value-box'>
                        <label className='add-comp-label'>Data</label>
                        <input className='add-comp-input' type='date' value={date}
                            onChange={event => setDate(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        <label className='validation-label'>{!errors.date.valid && errors.date.message}</label>
                    </div>

                </div>

                <div className='add-comp-input-container'>
                    <div className='input-value-box'>
                        <label className='add-comp-label'>Local</label>
                        <input className='add-comp-input' placeholder='Cidade, Localização ...' type='text' value={location}
                            onChange={event => setLocation(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        <label className='validation-label'>{!errors.location.valid && errors.location.message}</label>
                    </div>

                </div>

                <input type='file' required onChange={event => setSelectedFile(event.target.files[0])}></input>

                {/* <input className='addcomp-input' type='text' placeholder='Nome' required={true} onChange={event => setNome(event.target.value)}></input>
                <input className='addcomp-input' type='date' placeholder='Data' onChange={event => setData(event.target.value)}></input>
                <input className='addcomp-input' type='text' placeholder='Local' onChange={event => setLocal(event.target.value)}></input>
                <input type='file' onChange={event => setSelectedFile(event.target.files[0])}></input> */}
                <button className='add-comp-btn' type='submit'>Adicionar</button>
            </form>
        </div>
    )
}

export default AddCompetition
