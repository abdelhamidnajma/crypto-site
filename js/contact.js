document.addEventListener('DOMContentLoaded', () => {
    // Animeer de titel
    anime({
        targets: '.animated-title',
        opacity: 1,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Voeg event listener toe aan het contactformulier
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleContactSubmit);
});

function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Hier zou je normaal gesproken een API-call maken om het bericht te versturen
    // Voor dit voorbeeld simuleren we een succesvolle verzending
    if (name && email && subject && message) {
        // Simuleer een korte laadtijd
        setTimeout(() => {
            alert('Uw bericht is succesvol verzonden!');
            // Reset het formulier
            event.target.reset();
        }, 1000);
    } else {
        alert('Vul alstublieft alle velden in.');
    }
}

