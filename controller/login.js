document.addEventListener('DOMContentLoaded', () => {

    const botonIngresar = document.getElementById('buttom-login');
    const botonRegistrar = document.getElementById('buttom-signup');

    
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
                        window.location.href = 'proy_FC/view/public/dashboard.html';
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
        }
         else {
            Swal.fire({
                title: "Campos incompletos...",
                text: "LLena los campos antes de presionar sobre el boton ingresar!!",
                icon: "info",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    });

    // botonRegistrar.addEventListener('click', async (e) => {
    //     const frstnameusr = document.getElementById("frst-name-user").value;
    //     const frstScndName = document.getElementById("frst-lstname-user").value;
    //     const email = document.getElementById("email").value;
    //     const usuario = document.getElementById("new-username").value;
    //     const contrasena = document.getElementById("new-username","new-password").value;
    //     const inputs = document.querySelectorAll('signup-form input');
    //     const values = Array.from(inputs).map(input => input.value);


    //     if(values){
    //         Swal.fire({
    //             title: "Capos llenos!!!!",
    //             text: "Texto de pruebas... ",
    //             icon: "success",
    //             // timer: 2000,
    //             showConfirmButton: true,
    //         });
    //         console.log(values);
    //     }
    //     else{
    //         Swal.fire({
    //             title: "Campos incompletos!!!!",
    //             text: "Texto de pruebas... ",
    //             icon: "warning",
    //             // timer: 2000,
    //             showConfirmButton: true,
    //         });
    //         console.log(values);
    //     }


    // });
    // setTimeout(
    //     function() { 
    //         document.querySelector('.slogan-style').style.color = 'black'; 
    //     }, 1000);
    
});