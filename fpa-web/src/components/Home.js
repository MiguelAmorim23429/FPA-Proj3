import React, { useEffect, useState, useContext } from 'react';
import '../styles/home.css'
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from "firebase/database";
import { UserAuthContext } from '../context/AuthContextProvider';

import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as BsIcons from 'react-icons/bs'

import moment from 'moment';

const Home = () => {

  const db = getDatabase()
  const competitionsRef = ref(db, '/competicoes/')

  const [competitions, setCompetitions] = useState([])
  const [indexBtn, setIndexBtn] = useState(-1);
  const [sidebar, setSidebar] = useState(false);

  const { setIdComp, setNameComp, setDateComp, setLocationComp, setPhotoComp } = useContext(UserAuthContext);

  const navigate = useNavigate()

  useEffect(() => {

    const handler = (snapshot) => {

      let competitionsArray = []

      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        competitionsArray.push([childKey, childData])
      });
      setCompetitions(competitionsArray)
    }

    const fetchCompetitions = onValue(competitionsRef, handler)
    return (() => {
      // off(handler)
      fetchCompetitions()
    })
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
    setIdComp(key)
    setNameComp(value.nome)
    setDateComp(value.data)
    setLocationComp(value.local)
    setPhotoComp(value.foto)
    navigate('/updatecomp')
  }

  const deleteComp = (key, value) => { // so altera o estado, não apaga realmente da base de dados
    const idComp = key;

    const updates = {}
    updates[`/competicoes/${idComp}/ativa`] = false // atualiza o estado da competição para falso e na linha 89 mostramos só as competições com estado ativo

    update(ref(db), updates)
  }

  const goToProvasComp = (key) => { // funçao de redirecionar para o ecrã (ProvasCompetition) e passamos o id dessa prova para lá
    const idComp = key;
    setIdComp(key)
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
            <li>
              <button className='side-bar-btn' onClick={() => navigate('/addmanager')}>Adicionar Gestor</button>
            </li>
            <li>
              <button className='side-bar-btn' onClick={() => navigate('/permissionsmanager')}>Permissões Gestor</button>
            </li>
            <li>
              <button className='side-bar-btn' onClick={() => navigate('/addclub')}>Adicionar Clube</button>
            </li>
          </ul>
        </nav>
      </div>
      <div className='main-competition-container'>
        {competitions.map(([key, value], index) => {
          if (value.ativa) {
            return (
              <div key={key} className='competition-container'
                onMouseEnter={() => showButton(index)}
                onMouseLeave={hideButton}
                onClick={() => goToProvasComp(key)}>

                {value.foto && <img className='competition-img' src={value.foto} alt='foto competição'></img>}

                <div className='competition-info'>

                  <h2 className='title-header'>{value.nome}</h2>

                  <div className='label-container'>
                    <label>{moment(value.data).format('DD-MM-YYYY')}</label>
                    <label>{value.local}</label>
                  </div>

                  <div className='btn-container'>
                    <button className={indexBtn === index ? 'competition-btn-show' : 'competition-btn-hide'}
                      id='atualizar-competition-btn'
                      onClick={(e) => {
                        e.stopPropagation();
                        goToUpdateComp(key, value)
                      }}>
                      <BsIcons.BsPencil className='btn-icon' />
                      Atualizar
                    </button>
                    <button className={indexBtn === index ? 'competition-btn-show' : 'competition-btn-hide'}
                      id='apagar-competition-btn'
                      onClick={(e) => {
                        e.stopPropagation();
                        window.confirm("Deseja mesmo remover?") && deleteComp(key, value);
                      }}>
                      <BsIcons.BsTrash className='btn-icon' />

                      Remover


                    </button>
                  </div>
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