//IMPORT
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlerta } from "../functions.js";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';

//CUERPO COMPONENTE
const MascotasComponent = () => {
  const url = "http://localhost:8000/mascotas";
  const [mascotas, setMascotas] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [edad, setEdad] = useState("");
  const [disponible, setDisponible] = useState("");
  const [operacion, setOperacion] = useState("");
  const [titulo,setTitulo]=useState("");
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
    const storedAuth = localStorage.getItem("autenticado"); //Recuperar el estado de la variable segun sea el caso
    if (!storedAuth) { //Condicional para saber si esta autenticado o no
      console.log("Usuario no autenticado en MascotasComponent");
      setAutenticado(false);
      navigate('/login'); //Redirigir al usuario no autenticado al login
    }
  };

  const openModal =(opcion, id, nombre, especie, edad, disponible)=>{
    setId('');
    setNombre('');
    setEspecie('Especie');
    setEdad('');
    setDisponible(true);
    setOperacion(opcion);
    if(opcion === 1){
        setTitulo("Registrar Mascota");
    }
    else if(opcion===2){
        setTitulo("Editar Mascota");
        setId(id);
        setNombre(nombre);
        setEspecie(especie);
        setEdad(edad);
        setDisponible(disponible);
    }
  };

  const validar = ()=>{
    let parametros;
    let metodo;
    if(nombre.trim()===''){
        console.log("Debe escribir un Nombre");
        mostrarAlerta("Debe escribir un Nombre");
    }
    else if(edad.trim()===''){
        console.log("Debe escribir una Edad");
        mostrarAlerta("Debe escribir una Edad");
    }
    else if(especie.trim().toString()==='Especie'){
        console.log("Debe escribir una Especie");
        mostrarAlerta("Debe escribir una Especie");
    }
    else{
        if(operacion===1){
            parametros={
                urlExt: `${url}/crear`,
                nombre: nombre.trim(),
                especie: especie.toString(),
                edad: edad.trim(),
                disponible: disponible.toString()
            };
            metodo="POST";
        }
        else{
            parametros={
                urlExt: `${url}/actualizar/${id}`,
                nombre: nombre.trim(),
                especie: especie.toString(),
                edad: edad.trim(),
                disponible: disponible.toString()
            };
            metodo="PUT";
        }
        enviarSolicitud(metodo, parametros);
        
    }

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
  
  const eliminarMascota=(id,nombre)=>{
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: `Estas seguro de eliminar la mascota ${nombre} ?`,
        icon: 'question',
        text: 'Se eliminará Definitivamente',
        showCancelButton: true, 
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result)=>{
        if(result.isConfirmed){
            setId(id);
            enviarSolicitud("DELETE",{urlExt: `${url}/eliminar/${id}`,id:id})
        }
        else{
            mostrarAlerta("No se elimino la mascota","info");
        }

    })

  }

  const cerrarSesion = () => {
    setAutenticado(false); // Lógica para cerrar sesión
    // Limpia el estado autenticado en localStorage al cerrar sesión
    localStorage.removeItem("autenticado");
    checkAuthentication();
  };

  const mascotasFiltradas = mascotas.filter(
    (mascota) =>
      mascota.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      mascota.especie.toLowerCase().includes(filtro.toLowerCase())
  );

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
                </ul>
                <div class="d-flex justify-content-center">
                    <form class="d-flex" role="search">
                        <input 
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        ></input>
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
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
              </div>
            </div>
        </nav>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
               onClick={()=>openModal(1)}
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalMascotas"
              >
                <i className="fa-solid fa-circle-plus"></i> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>NOMBRE</th>
                    <th>ESPECIE</th>
                    <th>EDAD</th>
                    <th>DISPONIBLE</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {mascotasFiltradas.map((mascota, i) => (
                    <tr key={mascota.id}>
                      <td>{mascota.id}</td>
                      <td>{mascota.nombre}</td>
                      <td>{mascota.especie}</td>
                      <td>{mascota.edad}</td>
                      <td>{mascota.disponible ? 'Sí' : 'No'}</td>
                      <td>
                        <button
                          onClick={()=>openModal(2,mascota.id,mascota.nombre,mascota.especie,mascota.edad,mascota.disponible)}
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalMascotas"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                      </td>
                      <td>
                        <button
                            onClick={()=>eliminarMascota(mascota.id,mascota.nombre)} 
                            className="btn btn-danger">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div id="modalMascotas" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titulo}</label>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e)=>setNombre(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <select
                  id="especie"
                  className="form-control"
                  placeholder="Especie"
                  onChange={(e)=>setEspecie(e.target.value)}

                >
                  <option value={especie}>{especie}</option>
                  <option value={'Perro'}>Perro</option>
                  <option value={'Gato'}>Gato</option>
                </select>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="edad"
                  className="form-control"
                  placeholder="Edad"
                  value={edad}
                  onChange={(e)=>setEdad(e.target.value)}

                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="disponible"
                  className="form-control"
                  value={disponible === true ? "Sí" : "No"}
                  readOnly
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
export default MascotasComponent;