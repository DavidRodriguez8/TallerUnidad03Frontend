import {BrowserRouter,Routes,Route} from 'react-router-dom';
import MascotasComponent from './Components/MascotasComponent';
import AdopcionComponent from './Components/AdopcionComponent';
import SolicitudesComponent from './Components/SolicitudesComponent';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<MascotasComponent></MascotasComponent>}></Route>
        <Route path = '/adoptar' element = {<AdopcionComponent></AdopcionComponent>}></Route> {/*Nueva ruta para la adopción de mascotas*/}
        <Route path = '/visualizar' element = {<SolicitudesComponent></SolicitudesComponent>}></Route> {/*Nueva ruta para la visualización de solicitudes*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
