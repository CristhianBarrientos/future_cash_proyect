document.addEventListener('DOMContentLoaded', () => {

    const botonIngresar = document.getElementById('buttom-login');

    document.getElementById("show-signup").addEventListener("click", function (e) {
        e.preventDefault();
        clearElements();
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("signup-form").classList.add("show");
    });
    // boton volver
    document.getElementById("show-login").addEventListener("click", function (e) {
        e.preventDefault();
        clearElements(); // al regrsar al logiin se va a limpiar todo el formulario y se le va a quitar el formato
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
                        window.location.href = 'src/views/dashboard.html';
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

    const mensajeEmail = document.getElementById("mensajeEmail");
    document.getElementById('email').oninput = function () {
        const email = document.getElementById('email');
        const emailValor = email.value;
        const emailPatron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPatron.test(emailValor)) {
            mensajeEmail.textContent = "";
        } else {
            mensajeEmail.textContent = "Ingresa un correo real"
        }
    };

    var requiredInputs = document.querySelectorAll('input[required]');

    // evento que verifica cuando la persona esta escribiendo en el input, y se ejecuta 
    requiredInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            requiredFunction();
        });
    });

    // funcion que realiza la verificacion de los campos obligatorios 
    function requiredFunction() {
        requiredInputs.forEach(function (input) {
            const frstnameusr = document.getElementById("frst-name-user").value;
            const scndnameuser = document.getElementById("scnd-name-user").value;
            const frstLstName = document.getElementById("frst-lstname-user").value;
            const scndLstName = document.getElementById("scnd-lstname-user").value;
            const email = document.getElementById("email").value;
            const usuario = document.getElementById("new-username").value;
            const contrasena = document.getElementById("new-password").value;
            try {
                var varPrint = ""
                if (frstnameusr === "" || scndnameuser === "" || frstLstName === "" || scndLstName === "" || email === "" || usuario === "" || contrasena === "") {
                    // Implementacion de operadores ternarios para reducir el volumen del codigo (introduccion a lambdas en javascript) 
                    // PRIMER NOMBRE
                    varPrint = document.getElementById("frst-name-user")
                    frstnameusr === "" ? styleErr(varPrint) : removeStyleErr(varPrint);
                    // SEGUNDO NOMBRE
                    varPrint = document.getElementById("scnd-name-user")
                    scndnameuser ==="" ? styleErr(varPrint) : removeStyleErr(varPrint);
                    // PRIMER APELLIDO  
                    varPrint = document.getElementById("frst-lstname-user")
                    frstLstName ==="" ? styleErr(varPrint) : removeStyleErr(varPrint);
                    // SEGUNDO APELLIDO
                    varPrint = document.getElementById("scnd-lstname-user")
                    scndLstName === "" ? styleErr(varPrint) : removeStyleErr(varPrint);
                    // CORREO ELECTRONICO
                    varPrint = document.getElementById("email")
                    email === "" ? styleErr(varPrint) : removeStyleErr(varPrint);
                    // NOMBRE DE USUARIO
                    varPrint = document.getElementById("new-username")
                    usuario === "" ? styleErr(varPrint) : removeStyleErr(varPrint);
                    // CONTRASENIA
                    varPrint = document.getElementById("new-password")
                    contrasena === "" ? styleErr(varPrint) : removeStyleErr(varPrint);
                }

            } catch (error) {
                console.log(error)
            }
        });
    }

    function styleErr(varPrint) {
        if (varPrint && varPrint.style) {
            // varPrint.style.border = '1.5px dotted red';
            varPrint.classList.add('input-error');
        }
    }
    function removeStyleErr(varPrint) {
        if (varPrint && varPrint.style) {
            // varPrint.style.border = '';
            varPrint.classList.remove('input-error');
            varPrint.classList.add('right-side');
        }
    }

    function clearElements() {
        var inputs = document.querySelectorAll("input[required]");

        inputs.forEach(function (input) {
            input.value = "";
            input.classList.remove('input-error');
            mensajeEmail.textContent = ""
        });

        // inputs.forEach(function (input) {
        //     input.classList.remove('input-error');
        // });
    }

    // // campos incompletos 
    //     Swal.fire({
    //         title: "Campos incompletos!!!!",
    //         text: "Asegurese de llenar todos los campos obligatorios antes de continuar... ",
    //         icon: "warning",
    //         // timer: 2000,
    //         showConfirmButton: true,
    //     });
    //     // console.log(values);

    // // campos completos 
    // for (var i = 0; i < inputs.length; i++) {
    //     if (inputs !== "") {
    //         inputs[i].classList.remove('input-error');
    //         inputs[i].classList.add('right-side');
    //     }
    // }

    // Swal.fire({
    //     title: "Capos llenos!!!!",
    //     text: "Texto de pruebas... ",
    //     icon: "success",
    //     // timer: 2000,
    //     showConfirmButton: true,
    // });
    // // console.log(values);

});