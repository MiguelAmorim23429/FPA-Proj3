import React, { useState, useEffect } from 'react';
import '../styles/addcomp.css'
import { getDatabase, ref, push, child } from "firebase/database"
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { uploadBytes, ref as sref, getDownloadURL } from 'firebase/storage';

const AddCompetition = () => {

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
        if(selectedFile) {
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

    useEffect(() => {

        const emptyString = ''

        console.log(name)
        console.log(date)
        console.log(location)

        clearTimeout(timer)

        setTimer(
            setTimeout(() => {
                if (name === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        name: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                    console.log(`arroz: ${errors.name.message}`)
                } else if (name.length < 6) {
                    console.log(`${name} tem de ter mais de 6 caracteres`)
                    setErrors(prevState => ({
                        ...prevState,
                        name: {
                            valid: false,
                            message: 'O nome tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                    console.log(`nome valido: ${errors.name.valid} / hora valida: ${errors.date.valid} / categoria valida: ${errors.location.valid}`)
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        name: {
                            valid: true,
                            message: emptyString,
                        }
                    }))

                    console.log(`nome valido: ${errors.name.valid} / hora valida: ${errors.date.valid} / categoria valida: ${errors.location.valid}`)
                }
                if (date === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        date: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        date: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                    console.log(errors.date.valid)
                }
                if (location === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else if (location.length < 6) {
                    console.log(`${location} tem de ter mais de 6 caracteres`)

                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: false,
                            message: 'O local tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                    console.log(errors)
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                    console.log(errors)
                }

            }, 500)
        )
    }, [name, date, location]);

    

    return (
        <div className='main-add-comp-container'>
            <form className='add-comp-form' onSubmit={adicionarCompeticao}>

            <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Nome</label>
                        <input className='update-comp-input' type='text' value={name}
                            onChange={event => setName(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>aaa</label> */}
                        <label className='validation-label'>{!errors.name.valid && errors.name.message}</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Data</label>
                        <input className='update-comp-input' type='date' value={date}
                            onChange={event => setDate(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>bbb</label> */}
                        <label className='validation-label'>{!errors.date.valid && errors.date.message}</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Local</label>
                        <input className='update-comp-input' type='text' value={location}
                            onChange={event => setLocation(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>ccc</label> */}
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
