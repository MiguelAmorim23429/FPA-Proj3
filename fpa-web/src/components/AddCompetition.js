import React, { useState } from 'react';
import './addcomp.css'
import { getDatabase, ref, push, child } from "firebase/database"
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { uploadBytes, ref as sref, getDownloadURL } from 'firebase/storage';

const AddCompetition = () => {

    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    // const [url, setUrl] = useState(null)

    const navigate = useNavigate()

    const db = getDatabase()
    
    const competicoesRef = ref(db, '/competicoes/')
    
    const adicionarCompeticao = () => {
        let imagesRef
        if(selectedFile) { // se existir um ficheiro selecionado, cria a referencia no Firebase Storage para fazer upload dessa imagem lá
            imagesRef = sref(storage, `/images/${selectedFile.name}`);
        }


        uploadBytes(imagesRef, selectedFile) // upload da imagem selecionada para esta referência ao firebase storage
        .then(() => {
            getDownloadURL(imagesRef) // obtém o url de download de cada imagem
            .then((url) => {
                const newCompRef = push(competicoesRef, { // cria uma competição na base de dados, com um id gerado automaticamente
                    nome: nome,
                    data: data,
                    local: local,
                    ativa: true,
                    foto: url,
                })
            })
        })
        
        navigate('/')
    }

    return (
        <div className='main-addcomp-container'>
            <form className='addcomp-form' onSubmit={adicionarCompeticao}>
                <input className='addcomp-input' type='text' placeholder='Nome' required={true} onChange={event => setNome(event.target.value)}></input>
                <input className='addcomp-input' type='text' placeholder='Data' onChange={event => setData(event.target.value)}></input>
                <input className='addcomp-input' type='text' placeholder='Local' onChange={event => setLocal(event.target.value)}></input>
                <input type='file' onChange={event => setSelectedFile(event.target.files[0])}></input>
                <button className='addcomp-btn' type='submit'>Adicionar</button>
            </form>
        </div>
    )
}

export default AddCompetition
