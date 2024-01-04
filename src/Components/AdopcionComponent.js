//IMPORT
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlerta } from "../functions.js";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

//CUERPO COMPONENTE
const AdopcionComponent = () => {
  const url = "http://localhost:8000/mascotas";
  const [mascotas, setMascotas] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [edad, setEdad] = useState("");
  const [disponible, setDisponible] = useState("");
  const [operacion, setOperacion] = useState("");
  const [titulo,setTitulo]=useState("");
  //Tabla solicitudes_adopcion
  const urlS = "http://localhost:8000/solicitudes";
  const [solicitudes, setSolicitudes] = useState([]);
  const [idS, setIdS] = useState("");
  const [nombreS, setNombreS] = useState("");
  const [idMascota, setIdMascota] = useState("");
  const [estado, setEstado] = useState("");
  //Inicio de sesion
  const [autenticado, setAutenticado] = useState(false);
  const navigate = useNavigate();
  //Barra de búsqueda
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    getMascotas();
    checkAuthentication();
  }, []);

  const getMascotas = async () => {
    const respuesta = await axios.get(`${url}/buscar`);
    console.log(respuesta.data);
    setMascotas(respuesta.data);
  };

  const checkAuthentication = () => {
    const storedAuth = localStorage.getItem("autenticado");
    if (!storedAuth) {
      console.log("Usuario no autenticado en MascotasComponent");
      setAutenticado(false);
    }else{
      setAutenticado(true);
    }
  };

  const openModal =(opcion, idMascota, nombre, nombreS, idS, estado)=>{
    setIdS('');
    setNombreS('');
    setIdMascota(idMascota);
    setEstado('Pendiente');
    setOperacion(opcion);
    if(opcion === 1){
        setTitulo("Registar Solicitud");
        setDisponible(false) //Establecer valor default
        setNombre(nombre) //Para mostrar nombre en el modal
    }
    else if(opcion===2){
        setTitulo("Editar Solicitud");
        setIdS(idS);
        setNombreS(nombreS);
        setIdMascota(idMascota);
        setEstado(estado);
    }
  };

  const validar = async ()=>{
    let parametros;
    let metodo;
    if(nombreS.trim()===''){
        console.log("Debe escribir un Nombre");
        mostrarAlerta("Debe escribir un Nombre");
    }
    else{
        if(operacion===1){
            parametros={
                urlExt: `${urlS}/crear`,
                nombre_solicitante: nombreS.trim(),
                id_mascota: idMascota.toString(),
                estado: estado.trim()
            };
            metodo="POST";

            mascotasDisponible(); //Actualizar atributo de disponible
        }
        else{
            parametros={
                urlExt: `${urlS}/actualizar/${idS}`,
                nombre_solicitante: nombreS.trim(),
                id_mascota: idMascota.toString(),
                estado: estado.trim()
            };
            metodo="PUT";
        }
        await enviarSolicitud(metodo, parametros);
    }
  };

  const mascotasDisponible = async ()=>{
    let parametros;
    let metodo
    parametros={
        urlExt: `${url}/actualizar/${idMascota}`,
        disponible: disponible.toString() //Asignación del valor default para guardarlo en la base de datos
    };
    metodo="PUT";
    
    await enviarSolicitud(metodo, parametros);
  };


  const enviarSolicitud = async (metodo, parametros)=>{
    await axios({method: metodo, url: parametros.urlExt, data: parametros })
    .then((respuesta)=>{
        let tipo= respuesta.data.tipo;
        let mensaje = respuesta.data.mensaje;
        mostrarAlerta(mensaje,tipo);
        if(tipo ==="success"){
            document.getElementById("btnCerrarModal").click();
            getMascotas();
        }
    })
    .catch((error)=>{
        mostrarAlerta(`Error en la solicitud`,error)
    });
  };
  
  const infoMascota=(nombre,especie,edad)=>{
    const MySwal = withReactContent(Swal);
    let textoEspecie = ''; //Inicializar variable para guardar el texto
    //Condicional para que segun la especie se muestre cierto tipo de mensaje en el boton info
    if (especie === 'Perro') {
        textoEspecie = 'Son mascotas muy leales, protectores y juguetones. Los perros son animales sociales y necesitan atención y cuidado para mantenerse saludables y felices.';
    }
    else {
      textoEspecie = 'Son muy independientes, curiosos y cariñosos. Los gatos son animales sociales y necesitan atención y cuidado para mantenerse saludables y felices.'
    }
    MySwal.fire({
        title: `${nombre} | ${edad} años`,
        icon: 'info',
        text: textoEspecie,
        showCloseButton: true, 
        confirmButtonText: `<i class="fa fa-thumbs-up"></i> Entendido!`
    })
  }

  //Filtro para mostrar mascotas de acuerdo a la disponibilidad, se muestran los que estan disponibles (true)
  const mascotasDisponibles = mascotas.filter(mascota => mascota.disponible);

  //Fitro para mostrar mascotas de acuerdo a la disponibilidad y de acuerdo a la barra de busqueda
  const mascotasFiltradas = mascotasDisponibles.filter(
    (mascota) =>
      mascota.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      mascota.especie.toLowerCase().includes(filtro.toLowerCase())
  );

  const cerrarSesion = () => {
    setAutenticado(false); // Lógica para cerrar sesión
    // Limpia el estado autenticado en localStorage al cerrar sesión
    localStorage.removeItem("autenticado");
    navigate('/');
  };

  return (
    <div className="App">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img src="https://cdn-icons-png.flaticon.com/512/3047/3047928.png" alt="Logo" height="50" />
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="#">Inicio</a>
                    </li>
                    {autenticado ? (
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Mascota
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/mascotas">Registrar</a></li>
                            <li><a class="dropdown-item" href="/">Adoptar</a></li>
                            <li><hr class="dropdown-divider"></hr></li>
                            <li><a class="dropdown-item" href="/visualizar">Solicitudes</a></li>
                        </ul>
                        </li>
                    ):(
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" href="/">Adoptar</a>
                        </li>
                    )}
                </ul>
                <div class="d-flex justify-content-center">
                    <form class="d-flex" role="search">
                        <input 
                        class="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        ></input>
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
                {autenticado ? ( 
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="d-flex align-items-center">
                                    <img src="https://cdn-icons-png.flaticon.com/512/236/236831.png" alt="Logo" height="50" />
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="/login">Mi Perfil</a></li>
                                <li><a className="dropdown-item" href="#">Configuraciones</a></li>
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#" onClick={() => cerrarSesion()}>Cerrar Sesión</a></li>
                            </ul>
                        </li>
                    </ul>
                ) : ( 
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/login">
                                <img src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" alt="Logo" height="50" />
                            </a>
                        </li>
                    </ul>
                )}
              </div>
            </div>
        </nav>
        <div class="container text-center">
            <br></br>
            <br></br>
            <h2>Adoptar Mascotas</h2>
            <br></br>
            <div class="row">
                {mascotasFiltradas.map((mascota, i) => (
                    <div class="col">
                      <br></br>
                        <div class="card" style={{width: '18rem'}}>
                            <img src="https://img.freepik.com/vector-gratis/ilustracion-dibujos-animados-lindo-perro-gato-lindo_138676-3238.jpg?t=st=1703521635~exp=1703522235~hmac=33e9fd3ee940d2cf4cf0b397dd60d9578ecd4adc2cd8b158c272dbefef61cbb8" class="card-img-top" alt="..." style={{height: '200px'}}></img>
                            <div class="card-body">
                                <h5 class="card-title">{mascota.nombre} | {mascota.edad} años</h5>
                                <h6 class="card-subtitle mb-2 text-body-secondary">{mascota.especie}</h6>
                                <p class="card-text">{mascota.especie === 'Perro' ? 'Son mascotas muy leales, protec...' : 'Son muy independientes, curioso...'}</p>
                                <div class="row">
                                    <div class="col">
                                      <button
                                          onClick={()=>infoMascota(mascota.nombre,mascota.especie,mascota.edad)}
                                          className="btn btn-info"
                                      >
                                          <i className="fa-solid fa-circle-info"></i> Detalles
                                      </button>
                                    </div>
                                    <div class="col">
                                      <button
                                          onClick={()=>openModal(1,mascota.id, mascota.nombre)}
                                          className="btn btn-outline-success"
                                          data-bs-toggle="modal"
                                          data-bs-target="#modalSolicitudes"
                                      >
                                          <i className="fa-solid fa-square-plus"></i> Adoptar
                                      </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      <div id="modalSolicitudes" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titulo}</label>
            </div>
            <div className="modal-body">
              <input type="hidden" idS="idS"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombreS}
                  onChange={(e)=>setNombreS(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="idMascota"
                  className="form-control"
                  //Mostramos el nombre de la mascota en el form pero no guardamos en la base de datos
                  value={nombre}
                  readOnly
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="estado"
                  className="form-control"
                  value={estado}
                  readOnly
                  onChange={(e)=>setEstado(e.target.value)}

                ></input>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button onClick={()=>validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="btnCerrarModal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
        <button></button>
      </div>
    </div>
  );
};

//EXPORT
export default AdopcionComponent;