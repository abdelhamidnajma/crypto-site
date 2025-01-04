document.addEventListener('DOMContentLoaded', () => {
    // Animeer de titel
    anime({
        targets: '.animated-title',
        opacity: 1,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Voeg event listener toe aan het inlogformulier
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Hier zou je normaal gesproken een API-call maken om de inloggegevens te verifiëren
    // Voor dit voorbeeld simuleren we een succesvolle inlog
    if (username && password) {
        // Simuleer een korte laadtijd
        setTimeout(() => {
            alert('Succesvol ingelogd!');
            // Hier zou je de gebruiker normaal gesproken doorsturen naar een beveiligde pagina
            // window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        alert('Vul alstublieft beide velden in.');
    }
}

