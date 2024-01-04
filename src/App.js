import {BrowserRouter,Routes,Route} from 'react-router-dom';
import MascotasComponent from './Components/MascotasComponent';
import AdopcionComponent from './Components/AdopcionComponent';
import SolicitudesComponent from './Components/SolicitudesComponent';
import PersonasComponent from './Components/PersonasComponent';
import './App.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/mascotas' element = {<MascotasComponent></MascotasComponent>}></Route>
        <Route path = '/' element = {<AdopcionComponent></AdopcionComponent>}></Route> {/*Nueva ruta para la adopción de mascotas*/}
        <Route path = '/visualizar' element = {<SolicitudesComponent></SolicitudesComponent>}></Route> {/*Nueva ruta para la visualización de solicitudes*/}
        <Route path = '/login' element = {<PersonasComponent></PersonasComponent>}></Route> {/*Nueva ruta para la autenticación del administrador*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
