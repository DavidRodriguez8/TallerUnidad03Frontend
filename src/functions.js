import Swal from 'sweetalert2';
import  withReactContent from 'sweetalert2-react-content';

export function mostrarAlerta(mensaje, tipo, foco=''){
    onfocus(foco);
    const MySwal= withReactContent(Swal);
    MySwal.fire({
        title: mensaje,
        icon: tipo   
    });
}

function onfocus(foco){
    if(foco!==''){
        document.getElementById(foco).focus();
    }
}