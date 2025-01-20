document.addEventListener('DOMContentLoaded', () => {

    const botonIngresar = document.getElementById('buttom-login');

    
    document.getElementById("show-signup").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("signup-form").classList.add("show");
    });

    document.getElementById("show-login").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("signup-form").classList.remove("show");
        document.getElementById("login-form").classList.remove("hidden");
    });


    // Evento que permite que el boton realice la comparacion de el usuario y contrasenia de bd con la que coloca el usuario
    botonIngresar.addEventListener('click', async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario

        const userLog = document.getElementById('user').value;
        const passwordLog = document.getElementById('password').value;
        //alert('textoo de pruebas ' + userLog + passwordLog);
        //console.log(e);
        if ((userLog || passwordLog)) {


            try {
                const response = await fetch('http://localhost:1000/api/usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            usuario: userLog,
                            contrasena: passwordLog

                        }),
                });

                const data = await response.json();

                if (response.ok) {
                    //alert(data.message ); // realiza el mensaje de logica exitosa
                    // Redirige o realiza alguna acción
                    Swal.fire({
                        title: "Bienvenido " + userLog,
                        text: "Credenciales correctas...",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    setTimeout(() => {
                        window.location.href = 'proy_FC/public/dashboard.html';
                    }, 1500);
                } else {
                    // alert(data.message || 'Credenciales inválidas');
                    Swal.fire({
                        title: "Hubo un inconveniente :(",
                        text: "El usuario no existe o se encuentra inactivo...",
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                }

            } catch (error) {
                console.error('Error al realizar la solicitud:', error);
                Swal.fire({
                    title: "Hubo un inconveniente",
                    text: "No se pudo conectar con el servidor",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } else {
            Swal.fire({
                title: "Campos incompletos...",
                text: "LLena los campos antes de presionar sobre el boton ingresar!!",
                icon: "info",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    });

    setTimeout(
        function() { 
            document.querySelector('.slogan-style').style.color = 'black'; 
        }, 1000);
    
});