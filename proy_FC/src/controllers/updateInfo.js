document.addEventListener('DOMContentLoaded'), () => {

    async function currentInfo() {
        try {
            const response = await fetch('http://localhost:1000/api/usuarios/info', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ usuario: username})
            })
        } catch (error) {
            console.error('Error en el fetching del userInfo:', error);
        }
    }

}