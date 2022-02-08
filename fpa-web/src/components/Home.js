import React, { useEffect, useState } from 'react';
import logotest from '../assets/fpa-logo.png'
import './home.css'
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from "firebase/database"

import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'

const Home = () => {

  const db = getDatabase()
  const competicoesRef = ref(db, '/competicoes/')
  const [competicoes, setCompeticoes] = useState([])

  const [indexBtn, setIndexBtn] = useState(-1);
  const [sidebar, setSidebar] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    onValue(competicoesRef, (snapshot) => {
      let comps = []

      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        comps.push([childKey, childData])
      });
      setCompeticoes(comps)
      console.log(competicoes)
    }, {
      onlyOnce: true
    });
  }, [])

  const showSideBar = () => { setSidebar(!sidebar) }

  const showButton = (index) => {
    console.log(index)
    setIndexBtn(index)
  }

  const hideButton = () => {
    setIndexBtn(-1)
  }

  const goToUpdateComp = (key, value) => { // vai para o ecrã de atualizar a competição e envia os dados dela para lá para serem apresentados previamente nos inputs
    const idComp = key;
    const nomeComp = value.nome;
    const dataComp = value.data;
    const localComp = value.local;
    navigate('/updatecomp', { state: { idComp, nomeComp, dataComp, localComp } })
  }

  const deleteComp = (key, value) => { // so altera o estado, não apaga realmente da base de dados
    const idComp = key;

    const updates = {}
    updates[`/competicoes/${idComp}/ativa`] = false // atualiza o estado da competição para falso e na linha 89 mostramos só as competições com estado ativo

    update(ref(db), updates)
  }

  const goToProvasComp = (key) => { // funçao de redirecionar para o ecrã (ProvasCompetition) e passamos o id dessa prova para lá
    const idComp = key;
    navigate('/provas', { state: { idComp } })
  }

  return (
    <div>
      <div>
        <FaIcons.FaBars className='side-bar-openbtn' onClick={showSideBar} />
        <nav className={sidebar ? 'side-bar-show' : 'side-bar-hide'}>
          <ul className='side-bar-menu-times'>
            <li>
              <AiIcons.AiOutlineClose className='side-bar-closebtn' onClick={showSideBar} />
            </li>
            <li>
              <button className='side-bar-btn' onClick={() => navigate('/addcomp')}>Adicionar Competição</button>
            </li>
            <li>
              <button className='side-bar-btn' onClick={() => navigate('/addathlete')}>Adicionar Atleta</button>
            </li>
          </ul>
        </nav>
      </div>
      <div className='main-competicao-container'>
        {competicoes.map(([key, value], index) => {
          if (value.ativa) {
            return (
              <div key={key} className='competicao-container'
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
                  <button className={indexBtn === index ? 'competicao-btn-show' : 'competicao-btn-hide'} id='atualizar-competicao-btn' onClick={(e) => {
                    e.stopPropagation();
                    goToUpdateComp(key, value)
                  }}>Atualizar</button>
                  <button className={indexBtn === index ? 'competicao-btn-show' : 'competicao-btn-hide'} id='apagar-competicao-btn' onClick={(e) => {
                    e.stopPropagation();
                    window.confirm("Deseja mesmo remover?") && deleteComp(key, value);
                    window.location.reload(false);
                  }}>Remover</button>
                </div>
              </div>
            )
          }
        })}
      </div>
    </div>

  )
}

export default Home