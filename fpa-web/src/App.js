import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import AddCompetition from './components/AddCompetition';
import PrivateRoute from './components/PrivateRoute';
import UpdateCompetition from './components/UpdateCompetition';
import ProvasCompetition from './components/ProvasCompetition';
import Master from './components/Master';
import ParticipantsProva from './components/ParticipantsProva';
import AddAthlete from './components/AddAthlete';
import AddManagers from './components/AddManagers';
import ManagerPermissions from './components/ManagerPermissions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Master>
                <Home />
              </Master>
            </PrivateRoute>
          }
        />
        <Route path="/addcomp"
          element={
            <PrivateRoute>
              <Master>
                <AddCompetition />
              </Master>
            </PrivateRoute>
          }
        />
        <Route path="/updatecomp"
          element={
            <PrivateRoute>
              <Master>
                <UpdateCompetition />
              </Master>
            </PrivateRoute>
          } />
        <Route path="/provas"
          element={
            <PrivateRoute>
              <Master>
                <ProvasCompetition />
              </Master>
            </PrivateRoute>
          } />
          <Route path="/participantes"
          element={
            <PrivateRoute>
              <Master>
                <ParticipantsProva />
              </Master>
            </PrivateRoute>
          } />
          <Route path="/addathlete"
          element={
            <PrivateRoute>
              <Master>
                <AddAthlete />
              </Master>
            </PrivateRoute>
          } />
          <Route path="/addmanager"
          element={
            <PrivateRoute>
              <Master>
                <AddManagers />
              </Master>
            </PrivateRoute>
          } />
          <Route path="/permissionsmanager"
          element={
            <PrivateRoute>
              <Master>
                <ManagerPermissions />
              </Master>
            </PrivateRoute>
          } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
