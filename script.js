document.addEventListener('DOMContentLoaded', function() {

    const ramos = document.querySelectorAll('.ramo');
    const modal = document.getElementById('modal-requisitos');
    const cerrarModalBtn = document.querySelector('.cerrar-modal');
    const listaRequisitosUl = document.getElementById('lista-requisitos');
    const banner = document.getElementById('felicitaciones-banner');
    
    let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobados')) || [];
    let bannerTimeout;

    function mostrarBannerFelicitaciones() {
        clearTimeout(bannerTimeout);
        banner.classList.add('visible');
        bannerTimeout = setTimeout(() => {
            banner.classList.remove('visible');
        }, 4000);
    }

    function actualizarMalla() {
        const ramosS1a8 = [];
        for (let i = 1; i <= 8; i++) {
            const semestreContainer = document.querySelector(`#malla-curricular > .semestre:nth-child(${i})`);
            semestreContainer.querySelectorAll('.ramo').forEach(ramo => ramosS1a8.push(ramo.dataset.id));
        }

        ramos.forEach(ramo => {
            const id = ramo.dataset.id;
            const requisitos = JSON.parse(ramo.dataset.requisitos);

            ramo.classList.remove('aprobado', 'bloqueado');

            if (ramosAprobados.includes(id)) {
                ramo.classList.add('aprobado');
            } else {
                let requisitosCumplidos = true;
                if (requisitos.length > 0) {
                    if (requisitos[0] === "S1_S8") {
                        const aprobadosS1a8 = ramosS1a8.filter(idRamo => ramosAprobados.includes(idRamo));
                        if (aprobadosS1a8.length !== ramosS1a8.length) {
                            requisitosCumplidos = false;
                        }
                    } else {
                        for (const reqId of requisitos) {
                            if (!ramosAprobados.includes(reqId)) {
                                requisitosCumplidos = false;
                                break;
                            }
                        }
                    }
                }
                
                if (!requisitosCumplidos) {
                    ramo.classList.add('bloqueado');
                }
            }
        });
    }
    
    function manejarClickRamo(e) {
        const ramo = e.currentTarget;
        const id = ramo.dataset.id;

        if (ramo.classList.contains('bloqueado')) {
            const requisitos = JSON.parse(ramo.dataset.requisitos);
            const nombresRequisitosFaltantes = [];
            
            requisitos.forEach(reqId => {
                if (!ramosAprobados.includes(reqId)) {
                    const reqRamo = document.querySelector(`.ramo[data-id='${reqId}']`);
                    if(reqRamo === null && reqId === "S1_S8"){
                       nombresRequisitosFaltantes.push('TODOS los ramos hasta VIII Semestre');
                    } else if (reqRamo) {
                       nombresRequisitosFaltantes.push(reqRamo.dataset.nombre);
                    }
                }
            });
            
            mostrarModalRequisitos(nombresRequisitosFaltantes);
            return;
        }

        const yaEstabaAprobado = ramosAprobados.includes(id);
        
        if (yaEstabaAprobado) {
            ramosAprobados = ramosAprobados.filter(aprobadoId => aprobadoId !== id);
        } else {
            ramosAprobados.push(id);
            mostrarBannerFelicitaciones();
        }

        localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
        actualizarMalla();
    }

    function mostrarModalRequisitos(nombresRequisitos) {
        listaRequisitosUl.innerHTML = '';
        
        nombresRequisitos.forEach(nombre => {
            const li = document.createElement('li');
            li.textContent = nombre;
            listaRequisitosUl.appendChild(li);
        });

        modal.style.display = 'block';
    }

    ramos.forEach(ramo => {
        ramo.addEventListener('click', manejarClickRamo);
    });

    cerrarModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    actualizarMalla();
});
