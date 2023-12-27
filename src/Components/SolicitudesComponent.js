//IMPORT
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlerta } from "../functions.js";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";

//CUERPO COMPONENTE
const SolicitudesComponent = () => {
  const url = "http://localhost:8000/solicitudes";
  const [solicitudes, setSolicitudes] = useState([]);
  const [id, setId] = useState("");
  const [nombre_solicitante, setNombre] = useState("");
  const [id_mascota, setIdMascota] = useState("");
  const [estado, setEstado] = useState("");
  const [operacion, setOperacion] = useState("");
  const [titulo,setTitulo]=useState("");

  useEffect(() => {
    getSolicitudes();
  }, []);

  const getSolicitudes = async () => {
    const respuesta = await axios.get(`${url}/buscar`);
    console.log(respuesta.data);
    setSolicitudes(respuesta.data);
  };

  const enviarSolicitud = async (metodo, parametros)=>{
    await axios({method: metodo, url: parametros.urlExt, data: parametros })
    .then((respuesta)=>{
        let tipo= respuesta.data.tipo;
        let mensaje = respuesta.data.mensaje;
        mostrarAlerta(mensaje,tipo);
        if(tipo ==="success"){
            document.getElementById("btnCerrarModal").click();
            getSolicitudes();
        }
    })
    .catch((error)=>{
        mostrarAlerta(`Error en la solicitud`,error)
    });
  };
  
  const estadoAprobar=(id,nombre_solicitante)=>{
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: `Esta seguro de aprobar la solicitud de ${nombre_solicitante} ?`,
        icon: 'question',
        text: 'Tenga en cuenta de haber hecho el estudio anteriormente para que la mascota quede en buenas manos',
        showCancelButton: true, 
        confirmButtonText: 'Si, aprobar',
        cancelButtonText: 'Cancelar'
    }).then((result)=>{
        if(result.isConfirmed){
            enviarSolicitud("PUT",{urlExt: `${url}/actualizar/${id}`,estado:'Aprobado'})
        }
        else{
            mostrarAlerta("No se pudo aprobar la solicitud","info");
        }

    })
  }

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
                        <li><a class="dropdown-item" href="/">Registrar</a></li>
                        <li><a class="dropdown-item" href="/adoptar">Adoptar</a></li>
                        <li><hr class="dropdown-divider"></hr></li>
                        <li><a class="dropdown-item" href="/visualizar">Solicitudes</a></li>
                    </ul>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link disabled" aria-disabled="true">Perfil</a>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
                </div>
            </div>
        </nav>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>NOMBRE</th>
                    <th>MASCOTA</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {solicitudes.map((solicitud, i) => (
                    <tr key={solicitud.id}>
                      <td>{solicitud.id}</td>
                      <td>{solicitud.nombre_solicitante}</td>
                      <td>{solicitud.id_mascota}</td>
                      <td>{solicitud.estado}</td>
                      <td>
                        <button
                          onClick={()=>estadoAprobar(solicitud.id, solicitud.nombre_solicitante)}
                          className="btn btn-success"
                          disabled={solicitud.estado === 'Aprobado'}
                        >
                          <i className="fa-solid fa-check"></i>
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
    </div>
  );
};

//EXPORT
export default SolicitudesComponent;