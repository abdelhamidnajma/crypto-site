document.addEventListener('DOMContentLoaded', () => {
    // Animate the hero section
    anime({
        targets: '.hero-content > *',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(200),
        easing: 'easeOutQuad',
        duration: 800
    });

    anime({
        targets: '.hero-image',
        opacity: [0, 1],
        translateX: [50, 0],
        easing: 'easeOutQuad',
        duration: 1000
    });

    // Fetch featured coins and display them
    fetchFeaturedCoins();

    // Fetch latest news and display it
    fetchLatestNews();

    // Initialize portfolio tracker
    initializePortfolioTracker();
});

async function fetchFeaturedCoins() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
        const data = await response.json();
        displayFeaturedCoins(data);
    } catch (error) {
        console.error('Error fetching featured coins:', error);
    }
}

function displayFeaturedCoins(coins) {
    const coinGrid = document.querySelector('.coin-grid');
    coinGrid.innerHTML = coins.map((coin, index) => `
        <div class="coin-card" style="animation-delay: ${index * 0.2}s;">
            <img src="${coin.image}" alt="${coin.name}" />
            <h3>${coin.name}</h3>
            <p>$${coin.current_price.toFixed(2)}</p>
            <p class="${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </p>
        </div>
    `).join('');
    
    // Make featuredCoins available globally for portfolio tracker
    window.featuredCoins = coins;
}

async function fetchLatestNews() {
    // In a real application, you would fetch this from a news API
    // For this example, we'll use dummy data
    const dummyNews = [
        { title: "Bitcoin bereikt nieuw hoogtepunt", date: "2024-03-15", content: "Bitcoin heeft vandaag een nieuw all-time high bereikt..." },
        { title: "Ethereum 2.0 lancering nadert", date: "2024-03-14", content: "De langverwachte upgrade naar Ethereum 2.0 komt steeds dichterbij..." },
        { title: "Regulering van cryptocurrencies in de EU", date: "2024-03-13", content: "De Europese Unie heeft nieuwe richtlijnen aangekondigd voor cryptocurrency regulering..." }
    ];
    displayLatestNews(dummyNews);
}

function displayLatestNews(news) {
    const newsContainer = document.querySelector('.news-container');
    newsContainer.innerHTML = news.map((item, index) => `
        <div class="news-item" style="animation-delay: ${index * 0.2}s;">
            <h3>${item.title}</h3>
            <p>${item.date}</p>
            <p>${item.content.substring(0, 100)}...</p>
        </div>
    `).join('');
}

// Portfolio Tracker
function initializePortfolioTracker() {
    let portfolio = JSON.parse(localStorage.getItem('portfolio')) || {};
    const portfolioList = document.getElementById('portfolio-list');
    const portfolioTotal = document.getElementById('portfolio-total');
    const coinSelect = document.getElementById('coin-select');
    const coinAmount = document.getElementById('coin-amount');
    const addCoinForm = document.getElementById('add-coin-form');

    function updatePortfolioDisplay() {
        portfolioList.innerHTML = '';
        let total = 0;

        for (const [coin, amount] of Object.entries(portfolio)) {
            const coinData = window.featuredCoins.find(c => c.id === coin);
            if (coinData) {
                const value = amount * coinData.current_price;
                total += value;
                portfolioList.innerHTML += `
                    <div class="portfolio-item">
                        <span>${coinData.name}: ${amount} ${coinData.symbol.toUpperCase()}</span>
                        <span>$${value.toFixed(2)}</span>
                    </div>
                `;
            }
        }

        portfolioTotal.textContent = `Totale waarde: $${total.toFixed(2)}`;
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }

    function populateCoinSelect() {
        window.featuredCoins.forEach(coin => {
            const option = document.createElement('option');
            option.value = coin.id;
            option.textContent = coin.name;
            coinSelect.appendChild(option);
        });
    }

    addCoinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCoin = coinSelect.value;
        const amount = parseFloat(coinAmount.value);

        if (selectedCoin && amount > 0) {
            portfolio[selectedCoin] = (portfolio[selectedCoin] || 0) + amount;
            updatePortfolioDisplay();
            coinSelect.value = '';
            coinAmount.value = '';

            // Animate the new portfolio item
            anime({
                targets: '.portfolio-item:last-child',
                translateX: [-20, 0],
                opacity: [0, 1],
                easing: 'easeOutQuad',
                duration: 500
            });
        }
    });

    // Initialize the portfolio tracker
    populateCoinSelect();
    updatePortfolioDisplay();
}

