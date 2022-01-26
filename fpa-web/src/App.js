import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import AddCompetition from './components/AddCompetition';
import PrivateRoute from './components/PrivateRoute';
import UpdateCompetition from './components/UpdateCompetition';
import ProvasCompetition from './components/ProvasCompetition';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/addcomp" element={<AddCompetition />} />
        <Route path="/updatecomp" element={<UpdateCompetition />} />
        <Route path="/provascomp" element={<ProvasCompetition />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
