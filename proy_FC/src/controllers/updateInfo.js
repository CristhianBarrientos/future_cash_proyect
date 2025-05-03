document.addEventListener('DOMContentLoaded', () => {
    currentInfo();

    // aqui se muestra la informacion en el formulario de actualizacion de datos
    async function currentInfo() {
        try {
            const username = localStorage.getItem('username') || 'user';
            const newUsername = localStorage.getItem('new-username');
            if (!username) {
                alert('No se encontro usuario localStorage')
                return;
            }

            const response = await fetch('http://localhost:1000/api/usuarios/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: newUsername || username
                })
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud:  ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            //console.log('response server: ', data);

            const nombres = document.getElementById('currentNames');
            const apellidos = document.getElementById('currentLastNames');
            const usuario = document.getElementById('currentUsername');
            const correo = document.getElementById('currentEmail');

            if (!nombres || !apellidos || !usuario || !correo) {
                console.error('Uno o más elementos del formulario no se encontraron en el DOM');
                return;
            }

            nombres.value = data.nombres || '';
            apellidos.value = data.apellidos || '';
            usuario.value = data.usuario || '';
            correo.value = data.email || '';

        } catch (error) {
            console.error('Error en el fetching del userInfo:', error);
            // alert('No se pudo cargar la información del usuario. Por favor, intenta de nuevo más tarde.');
        }
    }
    window.currentInfo = currentInfo;
});