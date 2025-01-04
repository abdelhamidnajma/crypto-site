document.addEventListener('DOMContentLoaded', () => {
    // Animeer de titel
    anime({
        targets: '.animated-title',
        opacity: 1,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Haal marktgegevens op en toon ze
    fetchMarketData();

    // Maak en toon de markttrend grafiek
    createMarketTrendChart();
});

async function fetchMarketData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();
        displayMarketSummary(data.data);

        const coinsResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        const coinsData = await coinsResponse.json();
        displayCoinList(coinsData);
    } catch (error) {
        console.error('Error fetching market data:', error);
    }
}

function displayMarketSummary(data) {
    document.getElementById('total-market-cap').innerHTML = `
        <h3>Totale Marktkapitalisatie</h3>
        <p>$${formatNumber(data.total_market_cap.usd)}</p>
    `;
    document.getElementById('total-volume').innerHTML = `
        <h3>24u Volume</h3>
        <p>$${formatNumber(data.total_volume.usd)}</p>
    `;
    document.getElementById('btc-dominance').innerHTML = `
        <h3>Bitcoin Dominantie</h3>
        <p>${data.market_cap_percentage.btc.toFixed(2)}%</p>
    `;
}

function displayCoinList(coins) {
    const tableBody = document.querySelector('#coin-table tbody');
    tableBody.innerHTML = coins.map((coin, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <img src="${coin.image}" alt="${coin.name}" width="20" height="20" />
                ${coin.name} (${coin.symbol.toUpperCase()})
            </td>
            <td>$${coin.current_price.toFixed(2)}</td>
            <td class="${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>$${formatNumber(coin.market_cap)}</td>
        </tr>
    `).join('');
}

function createMarketTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Markt Trend',
                data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 55, 60, 70],
                fill: false,
                borderColor: 'rgb(255, 65, 54)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function formatNumber(num) {
    return num.toLocaleString('nl-NL', { maximumFractionDigits: 0 });
}

// Zoekfunctionaliteit
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const coinRows = document.querySelectorAll('#coin-table tbody tr');

    coinRows.forEach(row => {
        const coinName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (coinName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

