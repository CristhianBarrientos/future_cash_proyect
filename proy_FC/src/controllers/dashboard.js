// const e = require("express");

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('user-menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const opencloseNav = document.getElementById("toggleButton-SideNav");
    const toggleIcon = document.getElementById('side-nav-icon');
    // Función para abrir el sidebar
    var openclose = "cerrado";
    document.getElementById("sidenav").style.transform = "translateX(-100%)";

    // funcion que sirve para jalar la informacion del usuario
    async function fetchUserInfo() {
        try {
            // se simula el local storagex
            const username = localStorage.getItem('username') || 'user';
            const newUsername = localStorage.getItem('new-username');
            const response = await fetch('http://localhost:1000/api/usuarios/info', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                 },
                body: JSON.stringify({ 
                    usuario: username!= "" ? newUsername : username
                 })
            });
            const data = await response.json();
            if (response.ok) {
                document.getElementById('nombreUsuario').textContent = data.usuario.toLowerCase()
                    .split(" ")
                    .map(userCamel => userCamel.charAt(0).toUpperCase() + userCamel.slice(1))
                    .join(" ");

                document.getElementById('user-info').textContent = `Usuario:  \n${data.usuario} `;
                document.getElementById('email-info').textContent = `Email: ${data.email}`
            } else {
                document.getElementById('user-info').textContent = '(400) Error al cargar datos';
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            document.getElementById('user-info').textContent = '(404) No se pudo cargar la info';
        }
    }

    fetchUserInfo();

    toggleButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!toggleButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    })

    // funcion que se utiliza para abrir y cerrar la barra lateral
    opencloseNav.addEventListener('click', () => {
        // toggleIcon.classList.add('fade-out');
        toggleIcon.style.animation = "fade-in 1s ease";

        setTimeout(() => {
            if (openclose === "cerrado") {

                document.getElementById("main").style.marginLeft = "20vw";
                document.getElementById("sidenav").style.animation = "openSideNav 0.5s cubic-bezier(0.63, 0.99, 0.98, 0.90) normal forwards";
                document.getElementById("side-nav-icon").classList.remove("bx-menu");
                document.getElementById("side-nav-icon").classList.add("bx-menu-alt-right");
                openclose = "abierto";

            } else {

                document.getElementById("main").style.marginLeft = "0px";
                document.getElementById("sidenav").style.animation = "closeSideNav 0.3s cubic-bezier(0.84, 0.61, 1, 1) forwards";
                document.getElementById("side-nav-icon").classList.remove("bx-menu-alt-right");
                document.getElementById("side-nav-icon").classList.add("bx-menu");
                openclose = "cerrado";
            }
            // toggleIcon.classList.remove('fade-out');
            toggleIcon.style.animation = "fade-in 1s ease";

        }, 100);

    });

    // // eventos para abrir/cerrar el sidebar
    // document.getElementById("toggleButton-SideNav").addEventListener('click', opencloseNav);

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
            localStorage.removeItem('authToken');
            localStorage.removeItem('username ');
            // SE REDIRIGE A LA RUTA POR DEFECTO
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            console.log('El usuario canceló el cierre de sesión.');
        }
    }
    document.getElementById('buttom-logout').addEventListener('click', logout);

    document.getElementById("name-redirect").addEventListener('click', () => {
        window.location.href = '/';
    })

});