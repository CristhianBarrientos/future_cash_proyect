document.addEventListener('DOMContentLoaded', () => {
    // Función para abrir el sidebar
    var openclose = "cerrado";

    function opencloseNav() {
        if (openclose == "cerrado") {

            document.getElementById("sidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
            openclose = "abierto";
            console.log(openclose + "openNav");
            // return openclose;

        } else {

            document.getElementById("sidenav").style.width = "0px";
            document.getElementById("main").style.marginLeft = "0px";
            openclose = "cerrado";
            console.log(openclose + "closeNav");
            //     return openclose;        

        }
    }

    // Función pa la barrita de al lado
    function closeNav() {
        document.getElementById("sidenav").style.width = "0px";
        document.getElementById("main").style.marginLeft = "0px";
        openclose = "cerrado";
        console.log(openclose);
        return openclose;
    }

    // function openNav() {
    //     document.getElementById("sidenav").style.width = "250px";
    //     document.getElementById("main").style.marginLeft = "250px";
    //     openclose = "abierto";
    //     console.log(openclose + "openNav");
    //     return openclose;
    // }


    // function activar(){
    // prueba.classList.toggle('sideNav');
    // }

    // // eventos para abrir/cerrar el sidebar
    document.getElementById("buttom-open").addEventListener('click', opencloseNav);
    // document.getElementById("buttom-close").addEventListener('click', closeNav);
    // document.getElementById('sidenav').addEventListener('click',activar);



    // Función para cargar contenido dinámico
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', async function (event) {
            event.preventDefault();
            const url = this.getAttribute('href');
            const content = document.getElementById('content');

            try {
                content.innerHTML = '<p>Cargando...</p>'; // Indicador de carga
                const response = await fetch(url);
                if (!response.ok) throw new Error('Error al cargar el contenido');
                const data = await response.text();
                content.innerHTML = data; // Actualizar contenido 

                // Si el contenido cargado incluye un canvas para Chart.js, inicializa la gráfica
                if (url.includes('graficas.html')) {
                    const ctx = document.getElementById('barChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                            datasets: [{
                                label: 'Ventas',
                                data: [12, 19, 3, 5, 2, 3],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error al cargar el contenido:', error);
                content.innerHTML = '<p>Error al cargar el contenido. Por favor, intente de nuevo más tarde.</p>';
            }
        });
    });

    // Función para cerrar sesión
    async function logout() {
        const result = await Swal.fire({
            title: '¿Desea cerrar sesión?',
            text: "Al confirmar tu elección serás dirigido al Login...",
            icon: 'question', // "warning"
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: "Cerrando sesión... :(",
                text: "Serás redirigido al inicio de sesión.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            // Eliminar datos de autenticación
            localStorage.removeItem('authToken'); // Limpia el token de autenticación
            // sessionStorage.clear(); // CUANDO HAYA SESSION ID
            // document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // CUANDO TENGA TOKEN DE AUTH

            // SE REDIRIGE A LA RUTA POR DEFECTO
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            console.log('El usuario canceló el cierre de sesión.');
        }
    }

    // SE VINCULA
    const logoutButton = document.getElementById('buttom-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // esta funcion sirve para redirigir al dashboard cuando se presiona sobre el Logo 
    function redirect() {
        window.location.href = '/src/views/dashboard.html';
    }

    document.getElementById("name-redirect").addEventListener('click', redirect);

    
});