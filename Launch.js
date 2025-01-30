// Community Data
const communityData = [
    {
        id: 1,
        name: "Knowledge DAO",
        category: "knowledge",
        accessType: "sbt",
        economicModel: "subscription",
        description: "Premium educational content and expert network",
        members: 12500,
        image: "assets/community/knowledge-dao.png",
        tvl: "$1.2M"
    },
    {
        id: 2,
        name: "Creator Hub",
        category: "creator",
        accessType: "nft",
        economicModel: "hybrid",
        description: "Collaborative space for digital creators",
        members: 8750,
        image: "assets/community/creator-hub.png",
        tvl: "$850K"
    },
    {
        id: 3,
        name: "Governance Labs",
        category: "dao",
        accessType: "open",
        economicModel: "ownership",
        description: "Decentralized governance experiments",
        members: 15300,
        image: "assets/community/governance-labs.png",
        tvl: "$2.1M"
    }
];

// Trending Clubs Data
const mockTrendingData = [
    {
        name: 'Azuki',
        icon: '🎨',
        description: 'A top NFT community with unique art style',
        members: 15000,
        growth: '+25%'
    },
    {
        name: 'Bored Ape',
        icon: '🐵',
        description: 'The most influential NFT community',
        members: 20000,
        growth: '+15%'
    },
    {
        name: 'CryptoPunks',
        icon: '👾',
        description: 'Pioneer of NFT digital art collection',
        members: 18000,
        growth: '+10%'
    },
    {
        name: 'Doodles',
        icon: '🎨',
        description: 'Creative and artistic NFT community',
        members: 12000,
        growth: '+30%'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const searchInput = document.getElementById('domainSearch');
    const searchStatus = document.querySelector('.search-status');
    const configPanel = document.querySelector('.config-panel');
    const selectedDomain = document.querySelector('.selected-domain');
    const connectWalletBtn = document.querySelector('.connect-wallet-btn');
    const durationInputs = document.querySelectorAll('input[name="duration"]');
    const typeInputs = document.querySelectorAll('input[name="type"]');
    const registerBtn = document.querySelector('.register-btn');
    const transactionModal = document.querySelector('.transaction-modal');
    
    let searchTimeout;
    let currentDomain = '';
    let walletConnected = false;
    
    // Check URL parameters for domain
    const urlParams = new URLSearchParams(window.location.search);
    const domainFromURL = urlParams.get('domain');
    
    if (domainFromURL) {
        searchInput.value = domainFromURL;
        // Trigger domain check
        checkDomain(domainFromURL);
    }

    // ETH price config
    const ETH_PRICE = 1800;
    const PRICES = {
        1: 0.1,
        3: 0.25,
        5: 0.4
    };

    // Domain search handling
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        clearTimeout(searchTimeout);
        
        // Reset UI
        configPanel.style.display = 'none';
        searchStatus.style.display = 'none';
        
        // Validate input
        if (!isValidDomainName(query)) {
            if (query.length > 0) {
                showError('Domain can only contain letters, numbers, and hyphens');
            }
            return;
        }
        
        if (query.length < 3) {
            if (query.length > 0) {
                showError('Domain name must be at least 3 characters');
            }
            return;
        }
        
        // Show loading status
        showLoading();
        
        // Debounce search
        searchTimeout = setTimeout(() => checkDomain(query), 500);
    });

    // Show error message
    function showError(message) {
        searchStatus.innerHTML = `
            <div class="error-message">
                <span>❌ ${message}</span>
            </div>
        `;
        searchStatus.className = 'search-status error';
        searchStatus.style.display = 'flex';
    }

    // Show loading status
    function showLoading() {
        searchStatus.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Checking domain availability...</span>
        `;
        searchStatus.className = 'search-status loading';
        searchStatus.style.display = 'flex';
    }

    // Validate domain format
    function isValidDomainName(domain) {
        return /^[a-z0-9-]*$/.test(domain);
    }

    // Domain check (mock)
    async function checkDomain(domain) {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Random availability (mock)
            const isAvailable = Math.random() > 0.3;
            
            if (isAvailable) {
                searchStatus.innerHTML = `
                    <span class="domain-name">${domain}.web3.club is available!</span>
                    <button class="register-btn" onclick="showConfigPanel('${domain}')">Register Now</button>
                `;
                searchStatus.className = 'search-status available';
                currentDomain = domain;
            } else {
                searchStatus.innerHTML = `
                    <span class="domain-name">${domain}.web3.club is already registered</span>
                `;
                searchStatus.className = 'search-status taken';
            }
            
        } catch (error) {
            console.error('Domain check error:', error);
            showError('Error checking domain, please try again');
        }
    }

    // Show configuration panel
    window.showConfigPanel = function(domain) {
        configPanel.style.display = 'block';
        configPanel.style.opacity = '0';
        configPanel.style.transform = 'translateY(-20px)';
        
        selectedDomain.textContent = `${domain}.web3.club`;
        currentDomain = domain;
        
        // Trigger animation
        setTimeout(() => {
            configPanel.style.opacity = '1';
            configPanel.style.transform = 'translateY(0)';
        }, 50);
        
        // Smooth scroll to config section
        configPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        updateSummary();
    }

    // Update payment summary
    function updateSummary() {
        const duration = document.querySelector('input[name="duration"]:checked').value;
        const type = document.querySelector('input[name="type"]:checked').value;
        
        const ethPrice = PRICES[duration];
        const usdPrice = ethPrice * ETH_PRICE;
        
        document.querySelector('.domain-value').textContent = `${currentDomain}.web3.club`;
        document.querySelector('.duration-value').textContent = `${duration} Year${duration > 1 ? 's' : ''}`;
        document.querySelector('.type-value').textContent = type === 'creator' ? 'Creator Hub' : 'DAO Vault';
        document.querySelector('.eth-amount').textContent = `${ethPrice} ETH`;
        document.querySelector('.usd-amount').textContent = `($${usdPrice.toFixed(2)} USD)`;
        
        updateRegisterButton();
    }

    // Update register button status
    function updateRegisterButton() {
        if (!registerBtn) return;
        registerBtn.disabled = !walletConnected;
        registerBtn.textContent = walletConnected ? 'Register Domain' : 'Connect Wallet to Continue';
    }

    // Wallet connection handling
    connectWalletBtn.addEventListener('click', async () => {
        try {
            connectWalletBtn.textContent = 'Connecting...';
            // Mock wallet connection delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            walletConnected = true;
            const mockAddress = '0x' + Array(40).fill(0).map(() => 
                Math.floor(Math.random() * 16).toString(16)).join('');
            connectWalletBtn.textContent = `${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`;
            
            updateRegisterButton();
        } catch (error) {
            console.error('Wallet connection failed:', error);
            connectWalletBtn.textContent = 'Connect Wallet';
            walletConnected = false;
        }
    });

    // Handle registration process
    registerBtn.addEventListener('click', async () => {
        if (!walletConnected) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            // Show transaction status
            transactionModal.style.display = 'flex';
            
            // Mock transaction process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock transaction hash
            const txHash = '0x' + Array(64).fill(0).map(() => 
                Math.floor(Math.random() * 16).toString(16)).join('');
            
            // Update status
            const modalContent = transactionModal.querySelector('.modal-content');
            modalContent.innerHTML = `
                <div class="status-icon">✅</div>
                <h3 class="status-title">Registration Successful!</h3>
                <p class="status-desc">Your domain has been successfully registered.</p>
                <div class="transaction-hash">
                    <a href="https://etherscan.io/tx/${txHash}" target="_blank">
                        View on Etherscan
                    </a>
                </div>
            `;
            
            // Close status display after 5 seconds
            setTimeout(() => {
                transactionModal.style.display = 'none';
                searchInput.value = '';
                configPanel.style.display = 'none';
                searchStatus.style.display = 'none';
                currentDomain = '';
            }, 5000);
            
        } catch (error) {
            console.error('Registration error:', error);
            transactionModal.querySelector('.modal-content').innerHTML = `
                <div class="status-icon">❌</div>
                <h3 class="status-title">Registration Failed</h3>
                <p class="status-desc">Please try again later.</p>
            `;
        }
    });

    // Configuration option change handling
    durationInputs.forEach(input => {
        input.addEventListener('change', updateSummary);
    });

    typeInputs.forEach(input => {
        input.addEventListener('change', updateSummary);
    });

    // Initialize mobile menu
    setupMobileMenu();
});

// Setup mobile menu
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-explore');
    const searchResults = document.querySelector('.search-results');
    const trendingClubs = document.querySelector('.trending-clubs');
    
    // Mock clubs data
    const mockClubs = [
        {
            name: 'Azuki Official',
            type: 'Creator Hub',
            domain: 'azuki.web3.club',
            description: 'Official Azuki Community',
            members: '12K',
            growth: '+25%',
            icon: '🎨'
        },
        {
            name: 'Azuki Artists',
            type: 'Creator Hub',
            domain: 'artists.azuki.web3.club',
            description: 'Azuki Artists Community',
            members: '5K',
            growth: '+15%',
            icon: '🎨'
        },
        {
            name: 'Azuki DAO',
            type: 'DAO',
            domain: 'dao.azuki.web3.club',
            description: 'Azuki Governance DAO',
            members: '8K',
            growth: '+20%',
            icon: '⚡'
        }
    ];

    let currentFilter = 'all';

    searchInput.addEventListener('input', async function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length > 0) {
            // 1. Check domain availability
            const domainName = `${query}.web3.club`;
            const status = await checkDomainStatus(domainName);
            
            // 2. Search for matching clubs
            const filteredClubs = mockClubs.filter(club => {
                const matchesSearch = 
                    club.name.toLowerCase().includes(query) ||
                    club.domain.toLowerCase().includes(query) ||
                    club.description.toLowerCase().includes(query);
                
                const matchesType = 
                    currentFilter === 'all' || 
                    club.type === currentFilter;
                
                return matchesSearch && matchesType;
            });

            // Display combined results
            displaySearchResults(domainName, status, filteredClubs);
            searchResults.style.display = 'block';
            trendingClubs.style.display = 'none';
        } else {
            searchResults.style.display = 'none';
            trendingClubs.style.display = 'block';
        }
    });

    function displaySearchResults(domainName, status, clubs) {
        let resultsHTML = `
            <div class="domain-check-result">
                <span class="domain-name">${domainName}</span>
                <span class="domain-status ${status ? 'registered' : 'available'}">
                    ${status ? 'Registered' : 'Available'}
                </span>
            </div>
        `;

        if (clubs.length > 0) {
            resultsHTML += `
                <div class="related-clubs-section">
                    <div class="section-header">
                        <h2 class="section-title">Related Clubs</h2>
                        <div class="filter-buttons">
                            <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" 
                                    onclick="filterClubsByType('all')">All</button>
                            <button class="filter-btn ${currentFilter === 'Creator Hub' ? 'active' : ''}" 
                                    onclick="filterClubsByType('Creator Hub')">Creator Hub</button>
                            <button class="filter-btn ${currentFilter === 'DAO' ? 'active' : ''}" 
                                    onclick="filterClubsByType('DAO')">DAO</button>
                        </div>
                    </div>
                    <div class="related-clubs-list">
                        ${clubs.map(club => `
                            <div class="related-club-item">
                                <div class="related-club-header">
                                    <div class="related-club-icon">${club.icon}</div>
                                    <div class="related-club-name">${club.name}</div>
                                </div>
                                <div class="related-club-desc">${club.description}</div>
                                <div class="related-club-stats">
                                    <span>👥 ${club.members} members</span>
                                    <span>📈 ${club.growth} growth</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            resultsHTML += `
                <div class="no-clubs-found">
                    <p>No related clubs found</p>
                </div>
            `;
        }

        searchResults.innerHTML = resultsHTML;
    }

    // Mock domain status check
    async function checkDomainStatus(domain) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return Math.random() > 0.5;
    }

    // Update filter type
    window.filterClubsByType = function(type) {
        currentFilter = type;
        const query = searchInput.value.trim().toLowerCase();
        if (query.length > 0) {
            const filteredClubs = mockClubs.filter(club => {
                const matchesSearch = 
                    club.name.toLowerCase().includes(query) ||
                    club.domain.toLowerCase().includes(query) ||
                    club.description.toLowerCase().includes(query);
                
                const matchesType = 
                    type === 'all' || 
                    club.type === type;
                
                return matchesSearch && matchesType;
            });
            displaySearchResults(`${query}.web3.club`, Math.random() > 0.5, filteredClubs);
        }
    };
}

// Setup toggle buttons
function setupToggleButtons() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterClubsByType(btn.dataset.type);
        });
    });
}

// Initialize trending items
function initializeTrendingItems() {
    const trendingList = document.querySelector('.trending-list');
    const mockItems = [
        {
            name: 'Azuki',
            type: 'Creator Hub',
            icon: '🎨',
            description: 'A top NFT community with unique art style',
            members: '15.2K',
            growth: '+25%'
        },
        {
            name: 'Bored Ape',
            type: 'Creator Hub',
            icon: '🐵',
            description: 'The most influential NFT community',
            members: '20K',
            growth: '+15%'
        },
        {
            name: 'CryptoPunks',
            type: 'DAO',
            icon: '👾',
            description: 'Pioneer of NFT digital art collection',
            members: '18K',
            growth: '+10%'
        },
        {
            name: 'Doodles',
            type: 'Creator Hub',
            icon: '🎨',
            description: 'Creative and artistic NFT community',
            members: '12K',
            growth: '+30%'
        }
    ];

    trendingList.innerHTML = mockItems.map(item => `
        <div class="trending-item">
            <div class="trending-item-header">
                <div class="trending-item-icon">${item.icon}</div>
                <div class="trending-item-name">${item.name}</div>
            </div>
            <div class="trending-item-desc">${item.description}</div>
            <div class="trending-item-stats">
                <span>👥 ${item.members} members</span>
                <span>📈 ${item.growth} growth</span>
            </div>
        </div>
    `).join('');
}

// Filter clubs by type
function filterClubsByType(type) {
    console.log('Filtering clubs by type:', type);
    // TODO: Implement filtering logic
    // Here you can filter and display different clubs based on type
}

// Populate community grid
function populateCommunityGrid(filter = 'All') {
    const grid = document.querySelector('.community-grid');
    grid.innerHTML = '';

    const filteredData = filter === 'All' 
        ? communityData 
        : communityData.filter(item => item.category === filter);

    filteredData.forEach(community => {
        const card = createCommunityCard(community);
        grid.appendChild(card);
    });
}

// Create community card
function createCommunityCard(community) {
    const card = document.createElement('div');
    card.className = 'community-card';
    card.innerHTML = `
        <div class="card-image">
            <img src="${community.image}" alt="${community.name}" loading="lazy">
        </div>
        <div class="card-content">
            <h3>${community.name}</h3>
            <p>${community.description}</p>
            <div class="card-stats">
                <span>${community.members.toLocaleString()} members</span>
                <span>TVL: ${community.tvl}</span>
            </div>
            <div class="card-category">${community.category}</div>
        </div>
    `;

    // Add hover effects
    card.addEventListener('mouseenter', () => {
        const glowEffect = document.createElement('div');
        glowEffect.className = 'card-glow-effect';
        card.appendChild(glowEffect);

        // Add parallax effect to image
        const image = card.querySelector('img');
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            image.style.transform = `
                scale(1.1)
                translate(${x * 10}px, ${y * 10}px)
            `;
        });
    });

    card.addEventListener('mouseleave', () => {
        const glowEffect = card.querySelector('.card-glow-effect');
        if (glowEffect) {
            glowEffect.remove();
        }
        
        // Reset image position
        const image = card.querySelector('img');
        image.style.transform = '';
    });

    // Add click event
    card.addEventListener('click', () => {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
        
        // Navigate to community page (to be implemented)
        console.log(`Navigating to ${community.name}'s page`);
    });

    return card;
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    let activeFilters = {
        category: 'all',
        accessType: 'all',
        economicModel: 'all'
    };
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterGroup = button.closest('.filter-group');
            const filterType = getFilterType(filterGroup);
            
            // Remove active class from buttons in the same group
            filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update active filters
            activeFilters[filterType] = button.dataset.filter;
            
            // Filter communities
            filterCommunities(activeFilters);
        });
    });
}

function getFilterType(filterGroup) {
    const groupTitle = filterGroup.querySelector('h4').textContent.toLowerCase();
    if (groupTitle.includes('type')) return 'category';
    if (groupTitle.includes('access')) return 'accessType';
    if (groupTitle.includes('economic')) return 'economicModel';
    return 'category';
}

function filterCommunities(filters) {
    const filteredData = communityData.filter(community => {
        return (filters.category === 'all' || community.category === filters.category) &&
               (filters.accessType === 'all' || community.accessType === filters.accessType) &&
               (filters.economicModel === 'all' || community.economicModel === filters.economicModel);
    });
    
    renderCommunityGrid(filteredData);
}

function renderCommunityGrid(communities) {
    const grid = document.querySelector('.community-grid');
    grid.innerHTML = '';
    
    if (communities.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>No communities found</h3>
                <p>Try different filter combinations</p>
            </div>
        `;
        return;
    }
    
    communities.forEach(community => {
        const card = createCommunityCard(community);
        grid.appendChild(card);
    });
}

// Setup cursor glow effect
function setupCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.left = e.pageX + 'px';
            cursorGlow.style.top = e.pageY + 'px';
        });
    });
}

// Add scroll reveal animation
const scrollReveal = () => {
    const elements = document.querySelectorAll('.community-card');
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            el.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', scrollReveal);
scrollReveal();

// Setup sidebar collapse
function setupSidebarCollapse() {
    const sections = document.querySelectorAll('.sidebar-section');
    
    sections.forEach(section => {
        const heading = section.querySelector('h3');
        const content = section.querySelector('ul');
        
        // Initially collapse all sections except "Explore"
        if (!heading.textContent.includes('Explore')) {
            section.classList.add('collapsed');
        }
        
        heading.addEventListener('click', () => {
            section.classList.toggle('collapsed');
        });
    });
}

// Chain Data Dashboard
function initializeChainData() {
    // Mock API calls - replace with real API endpoints
    updateDomainCount();
    updateTradingVolume();
    updateGovernanceActivity();
    
    // Update data periodically
    setInterval(updateDomainCount, 30000);
    setInterval(updateTradingVolume, 60000);
    setInterval(updateGovernanceActivity, 300000);
}

async function updateDomainCount() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/subdomains/count');
        const count = await response.json();
        document.getElementById('domainCount').textContent = count.toLocaleString();
    } catch (error) {
        console.error('Failed to fetch domain count:', error);
        document.getElementById('domainCount').textContent = 'Error loading data';
    }
}

async function updateTradingVolume() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/trading/volume/24h');
        const data = await response.json();
        document.getElementById('volumeETH').textContent = `${data.eth} ETH`;
        document.getElementById('volumeUSDC').textContent = `$${data.usdc}`;
    } catch (error) {
        console.error('Failed to fetch trading volume:', error);
        document.getElementById('volumeETH').textContent = 'Error';
        document.getElementById('volumeUSDC').textContent = 'Error';
    }
}

async function updateGovernanceActivity() {
    try {
        // Replace with actual API call
        const response = await fetch('/api/governance/activity');
        const data = await response.json();
        const progressBar = document.getElementById('governanceProgress');
        const progressValue = document.getElementById('governanceValue');
        
        progressBar.style.width = `${data.percentage}%`;
        progressValue.textContent = `${data.percentage}%`;
    } catch (error) {
        console.error('Failed to fetch governance activity:', error);
        document.getElementById('governanceValue').textContent = 'Error';
    }
}

function populateHotDAO() {
    const daoContainer = document.querySelector('.hot-dao .community-grid');
    // Assuming there's an API to fetch popular DAO data
    const hotDAOs = [
        { name: 'DAO 1', description: 'Description 1', members: 1000 },
        { name: 'DAO 2', description: 'Description 2', members: 2000 },
        { name: 'DAO 3', description: 'Description 3', members: 3000 }
    ];
    hotDAOs.forEach(dao => {
        const daoCard = document.createElement('div');
        daoCard.className = 'community-card';
        daoCard.innerHTML = `
            <h3>${dao.name}</h3>
            <p>${dao.description}</p>
            <span>${dao.members} members</span>
        `;
        daoContainer.appendChild(daoCard);
    });
}

function populateHotCreator() {
    const creatorContainer = document.querySelector('.hot-creator .community-grid');
    // Assuming there's an API to fetch popular Creator Hub data
    const hotCreators = [
        { name: 'Creator Hub 1', description: 'Description 1', projects: 10 },
        { name: 'Creator Hub 2', description: 'Description 2', projects: 20 },
        { name: 'Creator Hub 3', description: 'Description 3', projects: 30 }
    ];
    hotCreators.forEach(creator => {
        const creatorCard = document.createElement('div');
        creatorCard.className = 'community-card';
        creatorCard.innerHTML = `
            <h3>${creator.name}</h3>
            <p>${creator.description}</p>
            <span>${creator.projects} projects</span>
        `;
        creatorContainer.appendChild(creatorCard);
    });
}

function populateTrending() {
    const trendingContainer = document.querySelector('.trending .ranking-list');
    // Assuming there's an API to fetch recent total ranking popularity data
    const trendingItems = [
        { name: 'Item 1', score: 95 },
        { name: 'Item 2', score: 90 },
        { name: 'Item 3', score: 85 }
    ];
    trendingItems.forEach(item => {
        const trendingCard = document.createElement('div');
        trendingCard.className = 'ranking-item';
        trendingCard.innerHTML = `
            <h3>${item.name}</h3>
            <span>Score: ${item.score}</span>
        `;
        trendingContainer.appendChild(trendingCard);
    });
}

function populateFastestGrowing() {
    const growthContainer = document.querySelector('.fastest-growing .growth-list');
    // Assuming there's an API to fetch 24-hour paid member growth data
    const growthItems = [
        { name: 'Community 1', growth: '50%' },
        { name: 'Community 2', growth: '45%' },
        { name: 'Community 3', growth: '40%' }
    ];
    growthItems.forEach(item => {
        const growthCard = document.createElement('div');
        growthCard.className = 'growth-item';
        growthCard.innerHTML = `
            <h3>${item.name}</h3>
            <span>Growth: ${item.growth}</span>
        `;
        growthContainer.appendChild(growthCard);
    });
}

// Setup navigation
function setupNavigation() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
    
    dropdownItems.forEach(item => {
        // Listen for mouse enter event
        item.addEventListener('mouseenter', () => {
            console.log('Mouse entered dropdown item');
            const dropdown = item.querySelector('.nav-dropdown');
            if (dropdown) {
                console.log('Found dropdown:', dropdown);
                console.log('Current visibility:', getComputedStyle(dropdown).visibility);
                console.log('Current opacity:', getComputedStyle(dropdown).opacity);
                console.log('Current display:', getComputedStyle(dropdown).display);
            }
        });

        // Listen for mouse leave event
        item.addEventListener('mouseleave', () => {
            console.log('Mouse left dropdown item');
        });
    });
}