// const e = require("cors");

document.addEventListener('DOMContentLoaded', () => {

    const botonIngresar = document.getElementById('buttom-login');
    const botonRegistrar = document.getElementById('buttom-signup');

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
        try {
            const userLog = document.getElementById('user').value;
            const passwordLog = document.getElementById('password').value;
            // alert('textoo de pruebas ' + userLog.toLowerCase() + passwordLog.toLowerCase());
            // console.log(e);
            if ((userLog !== "" || passwordLog !== "")) {
                console.log(userLog, passwordLog)

                try {
                    const response = await fetch('http://localhost:1000/api/usuarios/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(
                            {
                                usuario: userLog.toLowerCase(),
                                contrasena: passwordLog.toLowerCase()

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
                            title: "Los datos no coinciden.",
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
                    //timer: 2000,
                    showConfirmButton: true,
                });
            }
        } catch (Error) {
            alert(Error);
        }
    });

    // evento que va a permitir el registro de los usuarios
    botonRegistrar.addEventListener('click', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("frst-name-user").value;
        const secondName = document.getElementById("scnd-name-user").value;
        const frstLastName = document.getElementById("frst-lstname-user").value;
        const scndLastName = document.getElementById("scnd-lstname-user").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("new-username").value;
        const password = document.getElementById("new-password").value;

        console.log('Datos a enviar:', { firstName, secondName, frstLastName, scndLastName, email, username, password }); // Depuración

        const emailPatron = /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]{2,}([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/;
        const condicion = emailPatron.test(email);
        const resultadoValidacion = validarCorreo(condicion);

        if (resultadoValidacion === 1) {
            try {
                const response = await fetch('http://localhost:1000/api/usuarios/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        secondName,
                        frstLastName,
                        scndLastName,
                        email,
                        username,
                        password
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    Swal.fire({
                        title: "Registro exitoso",
                        text: "Usuario registrado correctamente",
                        icon: "success",
                        timer: 1800,
                        showConfirmButton: false,
                    });
                    setTimeout(() => {
                        window.location.href = '/src/views/dashboard.html'
                    }, 1800);
                } else {
                    Swal.fire({
                        title: "Error",
                        text: data.message || "No se pudo registrar el usuario",
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
    });


    document.getElementById('email').oninput = function () {
        const mensajeEmail = document.getElementById("mensajeEmail");
        const email = document.getElementById('email');
        const emailValor = email.value;
        // const emailPatron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const emailPatron = /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]{2,}([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/;
        const emailPatron = /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_-]{2,}([.][a-zA-Z0-9_-]+)*[.][a-zA-Z]{2,5}$/;

        var condicion = false;

        if (emailPatron.test(emailValor)) {
            mensajeEmail.textContent = "";
            condicion = true;
        } else {
            mensajeEmail.textContent = "Ingresa un correo real"
            condicion = false;
        }

    };

    var requiredInputs = document.querySelectorAll('input[required]');

    // evento que verifica cuando la persona esta escribiendo en el input, y se ejecuta 
    requiredInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            requiredFunction();
        });
    });
    // ===== REFACTORIZACIION DEL CODIGO ANTIGUO BUSCANDO NO REPETIR CODIGO INNECESARIAMENTE ==== 
    function validElements(varPrint, objDOM) {
        varPrint === "" ? styleErr(objDOM) : removeStyleErr(objDOM);
        // console.log(objDOM.classList);
    }
    // funcion que realiza la verificacion de los campos obligatorios 
    function requiredFunction() {
        requiredInputs.forEach(function () {
            try {
                // var varPrint = ""
                // incluimos un array para guardar todos los objetos del html y los valores de cada input para saber si se encuentra vacio o no
                const arrayFields = [
                    { varPrint: document.getElementById("frst-name-user").value, objDOM: document.getElementById("frst-name-user") },
                    { varPrint: document.getElementById("scnd-name-user").value, objDOM: document.getElementById("scnd-name-user") },
                    { varPrint: document.getElementById("frst-lstname-user").value, objDOM: document.getElementById("frst-lstname-user") },
                    { varPrint: document.getElementById("scnd-lstname-user").value, objDOM: document.getElementById("scnd-lstname-user") },
                    { varPrint: document.getElementById("email").value, objDOM: document.getElementById("email") },
                    { varPrint: document.getElementById("new-username").value, objDOM: document.getElementById("new-username") },
                    { varPrint: document.getElementById("new-password").value, objDOM: document.getElementById("new-password") }
                ];
                // basicamente aqui se envian los parametros para que se pueda validar si se pinta o no

                arrayFields.forEach(field => {
                    validElements(field.varPrint, field.objDOM);
                    // styleErr(field.objDOM);
                });

            } catch (error) {
                console.log(error)
            }
        });
    }

    function styleErr(varPrint) {
        if (varPrint && varPrint.style) {
            // varPrint.style.border = '1.5px dotted red';
            varPrint.classList.add('input-error');
            // console.log('STYLEERR');
        }
    }
    function removeStyleErr(varPrint) {
        if (varPrint && varPrint.style) {
            // varPrint.style.border = '';
            varPrint.classList.remove('input-error');
            varPrint.classList.add('right-side');
            // console.log('removeStyleErr');
        }
    }

    function clearElements() {
        var inputs = document.querySelectorAll("input[required]");

        inputs.forEach(function (input) {
            input.value = "";
            input.classList.remove('input-error');
            mensajeEmail.textContent = ""
        });
    }

    function validarCorreo(condicion) {
        const signupRequiredInputs = document.querySelectorAll("input[required]");
        const mensajeEmail = document.getElementById("mensajeEmail");
        var valor = 0;
        var emptyFieldCount = 0

        for (var i = 1; i < signupRequiredInputs.length; i++) {
            var inputValue = signupRequiredInputs[i].value;
            if (inputValue === "") {
                emptyFieldCount = emptyFieldCount + 1;
            }
        }
        if (emptyFieldCount > 1 || condicion === false) {
            if (emptyFieldCount > 1) {
                Swal.fire({
                    title: "Campos incompletos!!!!",
                    text: "Asegurese de llenar todos los campos de informacion antes de continuar... ",
                    icon: "info",
                    // timer: 2000,
                    showConfirmButton: true,
                })
            } else {
                Swal.fire({
                    title: "Formato incorrecto en el correo!",
                    text: "Coloca una direccion de correo electronico correcta. ",
                    icon: "info",
                    // timer: 2000,
                    showConfirmButton: true,
                });
            }
            valor = 0;

        } else {
            mensajeEmail.textContent = "";
            valor = 1;
            // Swal.fire({
            //     title: "Capos llenos!!!!",
            //     text: "Texto de pruebas... ",
            //     icon: "success",
            //     // timer: 2000,
            //     showConfirmButton: true,
            // });
            // console.log(mensajeEmail.value);
        }

        return valor;
    }

    // Lógica para el input de contraseña con ofuscación dinámica
    gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin);
    const BLINK_SPEED = 0.075;
    const TOGGLE_SPEED = 0.125;
    const ENCRYPT_SPEED = 0.80;

    let busy = false;

    const EYE = document.querySelector('.eye');
    const TOGGLE = document.querySelector('.form-group button');
    const INPUT = document.querySelector('#password');
    const PROXY = document.createElement('div');

    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';

    let blinkTl;
    const BLINK = () => {
        const delay = gsap.utils.random(2, 8);
        const duration = BLINK_SPEED;
        const repeat = Math.random() > 0.5 ? 3 : 1;
        blinkTl = gsap.timeline({
            delay,
            onComplete: () => BLINK(),
            repeat,
            yoyo: true
        })
            .to('.lid--upper', {
                morphSVG: '.lid--lower',
                duration
            })
            .to('#eye-open path', {
                morphSVG: '#eye-closed path',
                duration
            }, 0);
    };

    BLINK();

    const posMapper = gsap.utils.mapRange(-100, 100, 30, -30);
    let reset;

    const MOVE_EYE = ({ x, y }) => {
        if (reset) reset.kill();
        reset = gsap.delayedCall(2, () => {
            gsap.to('.eye', { xPercent: 0, yPercent: 0, duration: 0.2 });
        });
        const BOUNDS = EYE.getBoundingClientRect();
        gsap.set('.eye', {
            xPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.x - x)),
            yPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.y - y))
        });
    };

    window.addEventListener('pointermove', MOVE_EYE);

    TOGGLE.addEventListener('click', () => {
        if (busy) return;
        const isText = INPUT.matches('[type=password]');
        const val = INPUT.value;
        busy = true;
        TOGGLE.setAttribute('aria-pressed', isText);
        const duration = TOGGLE_SPEED;

        if (isText) {
            if (blinkTl) blinkTl.kill();

            gsap.timeline({
                onComplete: () => {
                    busy = false;
                }
            })
                .to('.lid--upper', {
                    morphSVG: '.lid--lower',
                    duration
                })
                .to('#eye-open path', {
                    morphSVG: '#eye-closed path',
                    duration
                }, 0)
                .to(PROXY, {
                    duration: ENCRYPT_SPEED,
                    onStart: () => {
                        INPUT.type = 'text';
                    },
                    onComplete: () => {
                        PROXY.innerHTML = '';
                        INPUT.value = val;
                    },
                    scrambleText: {
                        chars,
                        text: INPUT.value.charAt(INPUT.value.length - 1) === ' ' ?
                            `${INPUT.value.slice(0, INPUT.value.length - 1)}${chars.charAt(Math.floor(Math.random() * chars.length))}` :
                            INPUT.value
                    },
                    onUpdate: () => {
                        const len = val.length - PROXY.innerText.length;
                        INPUT.value = `${PROXY.innerText}${new Array(len).fill('•').join('')}`;
                    }
                }, 0);
        } else {
            gsap.timeline({
                onComplete: () => {
                    BLINK();
                    busy = false;
                }
            })
                .to('.lid--upper', {
                    morphSVG: '.lid--upper',
                    duration
                })
                .to('#eye-open path', {
                    morphSVG: '#eye-open path',
                    duration
                }, 0)
                .to(PROXY, {
                    duration: ENCRYPT_SPEED,
                    onComplete: () => {
                        INPUT.type = 'password';
                        INPUT.value = val;
                        PROXY.innerHTML = '';
                    },
                    scrambleText: {
                        chars,
                        text: new Array(INPUT.value.length).fill('•').join('')
                    },
                    onUpdate: () => {
                        INPUT.value = `${PROXY.innerText}${val.slice(PROXY.innerText.length, val.length)}`;
                    }
                }, 0);
        }
    });
});