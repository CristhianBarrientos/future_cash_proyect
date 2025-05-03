document.addEventListener('DOMContentLoaded', () => {
    const botonIngresar = document.getElementById('buttom-login');
    const botonRegistrar = document.getElementById('buttom-signup');


    // la sintaxis anterior era "const setupFormNavigation = function() {}"
    // esto para estandarizar el codigo y acostumbrarme a la sintaxis 
    const setupFormNavigation = () => {
        document.getElementById("show-signup").addEventListener("click", function (e) {
            // e.preventDefault();
            clearElements();
            document.getElementById("login-form").classList.add("hidden");
            document.getElementById("signup-form").classList.add("show");
            setTodayDate();
        });

        document.getElementById("show-login").addEventListener("click", function (e) {
            //e.preventDefault();
            clearElements();
            document.getElementById("signup-form").classList.remove("show");
            document.getElementById("login-form").classList.remove("hidden");
        });
    };

    const validElements = (valueDOM, objDOM) => {
        valueDOM === "" || valueDOM === "F" || valueDOM === "M" ? styleErr(objDOM) : removeStyleErr(objDOM);
    };

    // sintaxis anterior "function styleErr(valueDOM) {}"
    const styleErr = (valueDOM) => {
        if (valueDOM && valueDOM.style) {
            valueDOM.classList.add('input-error');
        }
    };

    const removeStyleErr = (valueDOM) => {
        if (valueDOM && valueDOM.style) {
            valueDOM.classList.remove('input-error');
            //valueDOM.classList.add('right-side');
            valueDOM.classList.add('gender-options')
        }
    };

    const clearElements = () => {
        var inputs = document.querySelectorAll('input[required]');

        inputs.forEach(function (input) {
            input.value = "";
            input.classList.remove('input-error');
            mensajeEmail.textContent = "";
        });
    };

    const requiredFunction = () => {
        // const requiredInputs = document.querySelectorAll('input[required]');
        // requiredInputs.forEach(function (input) {
        try {
            const arrayFields = [
                { valueDOM: document.getElementById("frst-name-user").value, objDOM: document.getElementById("frst-name-user") },
                { valueDOM: document.getElementById("scnd-name-user").value, objDOM: document.getElementById("scnd-name-user") },
                { valueDOM: document.getElementById("frst-lstname-user").value, objDOM: document.getElementById("frst-lstname-user") },
                { valueDOM: document.getElementById("scnd-lstname-user").value, objDOM: document.getElementById("scnd-lstname-user") },
                { valueDOM: document.getElementById("birthday-users").value, objDOM: document.getElementById("birthday-users") },
                { valueDOM: document.getElementById("email").value, objDOM: document.getElementById("email") },
                { valueDOM: document.getElementById("new-username").value, objDOM: document.getElementById("new-username") },
                { valueDOM: document.getElementById("new-password").value, objDOM: document.getElementById("new-password") },
                { valueDOM: document.querySelector('input[name="genre"]:checked') ? "selected" : "", objDOM: document.querySelector('.gender-group') }
            ];

            arrayFields.forEach(field => {
                validElements(field.valueDOM, field.objDOM);
                field.valueDOM;
            });

        } catch (error) {
            console.log(error);
        }
        //});
    };

    const validarCorreo = (condicion) => {
        const signupRequiredInputs = document.querySelectorAll("input[required]");
        const gender = document.querySelector('input[name="genre"]:checked')?.value;
        //console.log(signupRequiredInputs.value);
        const mensajeEmail = document.getElementById("mensajeEmail");
        var valor = 0;
        var emptyFieldCount = 0;

        for (var i = 1; i < signupRequiredInputs.length; i++) {
            var inputValue = signupRequiredInputs[i].value;
            console.log(inputValue);
            console.log(gender);
            if (inputValue === "" && gender === "") {
                emptyFieldCount = emptyFieldCount + 1;
            }
        }

        if (emptyFieldCount > 1 || condicion === false) {
            if (emptyFieldCount > 1) {
                Swal.fire({
                    title: "Campos incompletos!!!!",
                    text: "Asegurese de llenar todos los campos de informacion antes de continuar... ",
                    icon: "info",
                    showConfirmButton: true,
                });
            } else {
                Swal.fire({
                    title: "Formato incorrecto en el correo!",
                    text: "Coloca una direccion de correo electronico correcta. ",
                    icon: "info",
                    showConfirmButton: true,
                });
            }
            valor = 0;
        } else {
            mensajeEmail.textContent = "";
            valor = 1;
        }

        return valor;
    };

    const setupEmailValidation = () => {
        document.getElementById('email').oninput = function () {
            const mensajeEmail = document.getElementById("mensajeEmail");
            const email = document.getElementById('email');
            const emailValor = email.value;
            const emailPatron = /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_-]{2,}([.][a-zA-Z0-9_-]+)*[.][a-zA-Z]{2,5}$/;

            if (emailPatron.test(emailValor)) {
                mensajeEmail.textContent = "";
            } else {
                mensajeEmail.textContent = "Ingresa un correo real";
            }
        };
    };

        
    const login = async () => {
        const userLog = document.getElementById('user').value.trim();
        const passwordLog = document.getElementById('password').value.trim();
        try {


            if ((userLog !== "" || passwordLog !== "")) {
                // console.log(userLog, passwordLog);
                try {
                    const response = await fetch('http://localhost:1000/api/usuarios/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            usuario: userLog.toLowerCase(),
                            contrasena: passwordLog.toLowerCase()
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        Swal.fire({
                            title: "Bienvenido " + userLog,
                            text: "Credenciales correctas...",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                        localStorage.setItem('username', userLog.toLowerCase());
                        // console.log(localStorage.setItem('username2', data.usuario));
                        setTimeout(() => {
                            window.location.href = 'src/views/dashboard.html';
                        }, 1500);
                    } else {
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
                        text: "No se pudo conectar con el servidor 1 (" + error + ")",
                        icon: "error",
                        showConfirmButton: false,
                    });
                }
            } else {
                Swal.fire({
                    title: "Campos incompletos...",
                    text: "LLena los campos antes de presionar sobre el boton ingresar!!",
                    icon: "info",
                    showConfirmButton: true,
                });
            }
        } catch (Error) {
            alert(Error);
        };
        
    }

    const setupLoginButton = () => {
        botonIngresar.addEventListener('click', async (event) => {
            await login();
        });
    };

    const setupLoginInputs = () => {
        const usuario = document.getElementById('user');
        const password = document.getElementById('password');

        usuario.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter'){
                await login();
            }
        });

        password.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                await login();
            }
        });

    }

    const setupRegistrationButton = () => {
        botonRegistrar.addEventListener('click', async (e) => {
            // e.preventDefault();

            const firstName = document.getElementById("frst-name-user").value.trim();
            const secondName = document.getElementById("scnd-name-user").value.trim();
            const frstLastName = document.getElementById("frst-lstname-user").value.trim();
            const scndLastName = document.getElementById("scnd-lstname-user").value.trim();
            const age = document.getElementById("birthday-users").value.trim();
            const email = document.getElementById("email").value.trim();
            const genre = document.querySelector('input[name="genre"]:checked')?.value.trim();
            const username = document.getElementById("new-username").value.trim();
            const password = document.getElementById("new-password").value.trim();

            // console.log('Datos a enviar:', { firstName, secondName, frstLastName, scndLastName, age, email, genre, username, password });

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
                            age,
                            email,
                            genre,
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
                        localStorage.setItem('new-username', username.toLowerCase());
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
                        text: "No se pudo conectar con el servidor 2", error,
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    // funciones para ofuscar la contrasenia del nuevo usuario
    var flag = 1;

    const setupPasswordToggleSignup = () => {
        document.getElementById("spanPassword").addEventListener("click", function (e) {
            const inputPassword = document.getElementById("new-password");
            const imgSpan = document.getElementById("imgForSpan");

            if (flag === 1) {
                imgSpan.src = "/public/imagenes/sleeping-mask_17102564.gif"
                flag = 0;
            } else {
                imgSpan.src = "/public/imagenes/eye_11614427.gif"
                flag = 1;
            }

            inputPassword.type = inputPassword.type === "password" ? "text" : "password";

        });
    };


    // funcion para el ojo movible
    const setupPasswordToggle = () => {
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
    };

    // evento para los inputs requeridos
    const setupFormValidation = () => {
        const requiredInputs = document.querySelectorAll('input[required]');
        requiredInputs.forEach(function (input) {
            input.addEventListener("input", function () {
                requiredFunction();
            });
        });
    };

    const setTodayDate = () => {
        const today = new Date();
        const input = document.getElementById("birthday-users");

        const formattedDate = `${today.getFullYear() - 18}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        input.value = formattedDate;
    };

    document.getElementById("birthday-users").addEventListener("change", function (e) {
        const mensajeMayorEdad = document.getElementById("mensajeBirthday");
        const edadUser = document.getElementById("birthday-users").value;
        const restaEdad = new Date();
        var result = restaEdad.getFullYear() - edadUser.substring(0, 4);
        if (result <= 18) {
            mensajeMayorEdad.textContent = "Necesitas ser Mayor de Edad";
            edadUser.classList.add('input-error');
        } else {
            mensajeMayorEdad.textContent = "";
            edadUser.classList.remove('input-error');

        }
        // console.log(edadUser.substring(0, 4));
        // console.log(restaEdad.getFullYear());
        // console.log(result);
    });



    // Aqui se inician todos los componentes 
    const init = () => {
        setupFormNavigation();
        setupEmailValidation();
        setupLoginButton();
        setupLoginInputs();
        setupRegistrationButton();
        setupPasswordToggle();
        setupFormValidation();
        setupPasswordToggleSignup();
    };

    // Inicia el aplicativo 
    init();
});