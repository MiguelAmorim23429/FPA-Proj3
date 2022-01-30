import React, { useContext, useEffect, useState } from 'react';
import logo from '../assets/home-logo.jpg'
import logotest from '../assets/fpa-logo.png'
import './home.css'
import { UserAuthContext } from '../context/AuthContextProvider';
import { useNavigate, Navigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from "firebase/database"

const Home = () => {

  const { user } = useContext(UserAuthContext);
  const { logout } = useContext(UserAuthContext);

  const db = getDatabase()
  const competicoesRef = ref(db, '/competicoes/')
  const [competicoes, setCompeticoes] = useState([])

  const [style, setStyle] = useState('competicao-btn-hide');
  const [indexBtn, setIndexBtn] = useState(-1);

  const navigate = useNavigate()

  useEffect(() => {
    onValue(competicoesRef, (snapshot) => {
      let comps = []
      
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        const arrayEntries = Object.entries(childData)

        comps.push([childKey, childData])
      });
      setCompeticoes(comps)
      console.log(competicoes)
    }, {
      onlyOnce: true
    });
  }, [])

  const showButton = (index) => {
    console.log(index)
    setIndexBtn(index)
  }

  const hideButton = () => {
    setIndexBtn(-1)
  }

  const goToUpdateComp = (key, value) => {
    const idComp = key;
    const nomeComp = value.nome;
    const dataComp = value.data;
    const localComp = value.local;
    navigate('/updatecomp', { state: { idComp, nomeComp, dataComp, localComp } })
  }

  const deleteComp = (key, value) => {
    const idComp = key;

    const updates = {}
    updates[`/competicoes/${idComp}/ativa`] = false

    update(ref(db), updates)
  }

  const goToProvasComp = (key) => {
    const idComp = key;
    navigate('/provas', { state: { idComp } })
  }

  return (
    <div className='main-competicao-container'>

      <button onClick={() => navigate('/addcomp')}>Adicionar Competição</button>
      <button onClick={() => navigate('/addathlete')}>Adicionar Atleta</button>

      {competicoes.map(([key, value], index) => {
        if (value.ativa) {
          return (
            <div key={key}>
              <div className='competicao-container'
                onMouseEnter={() => showButton(index)}
                onMouseLeave={hideButton}
                onClick={() => goToProvasComp(key)}>
                <div className='competicao-info-container'>
                  <h2>{value.nome}</h2>
                  <img className='competicao-img' src={logotest} alt='foto competição'></img>
                  <label className='competicao-label'>{value.data}</label>
                  <label className='competicao-label'>{value.local}</label>
                </div>
                <div className='competicao-btn-container'>
                  <button className={indexBtn == index ? 'competicao-btn-show' : 'competicao-btn-hide'} id='atualizar-competicao-btn' onClick={(e) => {
                    e.stopPropagation();
                    goToUpdateComp(key, value)}}>Atualizar</button>
                  <button className={indexBtn == index ? 'competicao-btn-show' : 'competicao-btn-hide'} id='apagar-competicao-btn' onClick={(e) => {
                    e.stopPropagation();
                    window.confirm("Deseja mesmo remover?") && deleteComp(key, value)}}>Remover</button>
                </div>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default Home