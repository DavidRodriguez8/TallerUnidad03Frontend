//IMPORT
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlerta } from "../functions.js";
import '../estilos.css'

//CUERPO COMPONENTE
const PersonasComponent = () => {
  const url = "http://localhost:8000/autenticacion";
  const [correo, setCorreo] = useState("");
  const [contraseña, setPassword] = useState("");
  //Inicio de sesión
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("autenticado");
    if (storedAuth) {
      setAutenticado(JSON.parse(storedAuth));
    }
  }, []);

  const enviarSolicitud = async (metodo, parametros)=>{
    await axios({method: metodo, url: parametros.urlExt, data: parametros })
    .then((respuesta)=>{
        let tipo= respuesta.data.tipo;
        let mensaje = respuesta.data.mensaje;
        mostrarAlerta(mensaje,tipo);
        if(tipo === "success"){
            aceptarInicio(); 
        }
    })
    .catch((error)=>{
        mostrarAlerta(`Error en la solicitud`,error)
    });
  };
  
  const validar = ()=>{
    let parametros;
    let metodo;
    if(correo.trim()===''){
        console.log("Debe escribir un Correo");
        mostrarAlerta("Debe escribir un Correo");
    }
    else if(contraseña.trim()===''){
        console.log("Debe escribir una Contraseña");
        mostrarAlerta("Debe escribir una Contraseña");
    }
    else{
        parametros={
            urlExt: `${url}/autenticar`,
            correo: correo.trim(),
            contraseña: contraseña.trim(),
        };
        metodo="POST";

        enviarSolicitud(metodo, parametros);
        
    }

  };

  const cerrarSesion = () => {
    setAutenticado(false); // Lógica para cerrar sesión
    // Limpia el estado autenticado en localStorage al cerrar sesión
    localStorage.removeItem("autenticado");
  };

  const aceptarInicio = () => {
    setAutenticado(true); // Establecer el estado como autenticado después de una autenticación exitosa
    // Guarda el estado autenticado en localStorage al iniciar sesión
    localStorage.setItem("autenticado", true);
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
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
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
        {autenticado ? (
            <div>
                {/* Contenido para usuarios autenticados */}
                <br></br>
                <h2 style={{ textAlign: "center" }} >Bienvenido(a)</h2>
                <br></br>
                <br></br>
                <br></br>
                <button
                type="button"
                className="btn btn-danger btn-block mb-4"
                onClick={() => cerrarSesion()}
                >
                Cerrar Sesión
                </button>
            </div>
        ) : (
            <section class=" text-center text-lg-start">
            {/* Contenido para usuarios NO autenticados */}
            <div class="card mb-3">
                <div class="row g-0 d-flex align-items-center">
                    <div class="col-lg-4 d-none d-lg-flex">
                        <img src="https://img.freepik.com/fotos-premium/retrato-perro-border-collie-gato-escondido-detras_748076-74.jpg" alt="Photo" height="610"
                        className="w-100 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5" />
                    </div>
                    <div class="col-lg-8">
                        <h2 style={{ textAlign: "center" }} >Iniciar Sesión</h2>
                        <div class="card-body py-5 px-md-5">
                            <form>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">
                                    <i className="fa-solid fa-at"></i>
                                    </span>
                                    <input
                                    type="email"
                                    id="correo"
                                    className="form-control"
                                    placeholder="Dirección de correo"
                                    value={correo}
                                    onChange={(e)=>setCorreo(e.target.value)}
                                    ></input>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">
                                    <i className="fa-solid fa-key"></i>
                                    </span>
                                    <input
                                    type="password"
                                    id="contraseña"
                                    class="form-control"
                                    placeholder="Contraseña"
                                    value={contraseña}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    ></input>
                                </div>
                                <div class="row mb-4">
                                    <div class="col d-flex justify-content-center">
                                        <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                                        <label class="form-check-label" htmlFor="form2Example31"> Remember me </label>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <a href="#!">Forgot password?</a>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col d-flex justify-content-center">
                                        <button 
                                            type="button" 
                                            class="btn btn-primary btn-block mb-4" 
                                            onClick={()=>validar()}
                                            style={{ width: "50%", height: "50px", fontSize: "1.5rem" }}
                                        >Sign in</button>  
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        )}
    </div>
  );
};

//EXPORT
export default PersonasComponent;