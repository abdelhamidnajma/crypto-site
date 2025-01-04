let priceChart;

document.addEventListener('DOMContentLoaded', () => {
    // Animeer de titel
    anime({
        targets: '.animated-title',
        opacity: 1,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Haal coin ID op uit URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const coinId = urlParams.get('id') || 'bitcoin'; // Default naar bitcoin als er geen ID is

    // Haal coingegevens op en toon ze
    fetchCoinData(coinId);

    // Voeg event listeners toe aan tijdsframe knoppen
    document.querySelectorAll('.time-frame').forEach(button => {
        button.addEventListener('click', () => updateChart(coinId, button.dataset.days));
    });
});

async function fetchCoinData(coinId) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const data = await response.json();
        displayCoinData(data);
        updateChart(coinId, 7); // Standaard 7 dagen weergeven
    } catch (error) {
        console.error('Error fetching coin data:', error);
    }
}

function displayCoinData(data) {
    document.title = `CryptoVerse - ${data.name}`;
    document.getElementById('coin-name').textContent = data.name;
    document.getElementById('coin-image').src = data.image.large;
    document.getElementById('coin-price').textContent = `$${data.market_data.current_price.usd.toFixed(2)}`;
    
    const priceChange = data.market_data.price_change_percentage_24h;
    const changeElement = document.getElementById('coin-change');
    changeElement.textContent = `${priceChange.toFixed(2)}%`;
    changeElement.className = priceChange >= 0 ? 'positive' : 'negative';

    document.getElementById('market-cap').textContent = `Marktkapitalisatie: $${formatNumber(data.market_data.market_cap.usd)}`;
    document.getElementById('volume').textContent = `24u Volume: $${formatNumber(data.market_data.total_volume.usd)}`;
    document.getElementById('circulating-supply').textContent = `Circulerende voorraad: ${formatNumber(data.market_data.circulating_supply)} ${data.symbol.toUpperCase()}`;

    document.getElementById('description').innerHTML = data.description.nl || data.description.en;
}

async function updateChart(coinId, days) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
        const data = await response.json();
        
        const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
        const prices = data.prices.map(price => price[1]);

        if (priceChart) {
            priceChart.destroy();
        }

        const ctx = document.getElementById('priceChart').getContext('2d');
        priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Prijs (USD)',
                    data: prices,
                    borderColor: 'rgb(255, 65, 54)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Datum'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Prijs (USD)'
                        }
                    }
                }
            }
        });

        // Update active button
        document.querySelectorAll('.time-frame').forEach(button => {
            button.classList.toggle('active', button.dataset.days === days.toString());
        });
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

function formatNumber(num) {
    return num.toLocaleString('nl-NL', { maximumFractionDigits: 0 });
}

