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

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupTrendingClubs();
    setupMobileMenu();
    setupToggleButtons();
});

function setupSearch() {
    const searchInput = document.querySelector('.search-explore');
    const searchResults = document.querySelector('.search-results');
    const trendingClubs = document.querySelector('.trending-clubs');

    searchInput.addEventListener('input', async function() {
        const query = this.value.trim();
        if (query.length > 0) {
            const domainName = `${query}.web3.club`;
            const status = await checkDomainStatus(domainName);
            searchResults.innerHTML = `
                <div class="domain-result">
                    <span class="domain-name">${domainName}</span>
                    <span class="domain-status ${status ? 'registered' : 'available'}">
                        ${status ? 'Registered' : 'Available'}
                    </span>
                </div>
            `;
            searchResults.style.display = 'block';
            trendingClubs.style.display = 'none';
        } else {
            searchResults.style.display = 'none';
            trendingClubs.style.display = 'block';
        }
    });
}

function setupTrendingClubs() {
    const trendingList = document.querySelector('.trending-list');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentPageSpan = document.querySelector('.current-page');
    const totalPagesSpan = document.querySelector('.total-pages');

    const trendingClubs = [
        {
            name: 'BAYC',
            icon: '🐵',
            description: 'The Bored Ape Yacht Club is a collection of 10,000 unique NFTs.',
            members: '6.5K',
            volume: '150 ETH'
        },
        {
            name: 'CryptoPunks',
            icon: '👾',
            description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017.',
            members: '5.2K',
            volume: '120 ETH'
        },
        {
            name: 'Doodles',
            icon: '🎨',
            description: 'A community-driven collectibles project featuring art by Burnt Toast.',
            members: '4.8K',
            volume: '80 ETH'
        },
        {
            name: 'Azuki',
            icon: '⛩️',
            description: 'A brand for the metaverse. Built by the community.',
            members: '4.2K',
            volume: '95 ETH'
        },
        {
            name: 'CloneX',
            icon: '🤖',
            description: 'RTFKT x Takashi Murakami Clone X NFT Collection.',
            members: '3.8K',
            volume: '85 ETH'
        },
        {
            name: 'Moonbirds',
            icon: '🦉',
            description: 'A collection of 10,000 utility-enabled PFPs.',
            members: '3.5K',
            volume: '75 ETH'
        },
        {
            name: 'World of Women',
            icon: '👩',
            description: 'Empowering women through Web3 and NFTs.',
            members: '3.2K',
            volume: '65 ETH'
        },
        {
            name: 'VeeFriends',
            icon: '🦁',
            description: 'Gary Vaynerchuk\'s NFT collection representing intellectual property.',
            members: '3.0K',
            volume: '60 ETH'
        }
    ];

    // Determine items per page based on screen width
    function getItemsPerPage() {
        return window.innerWidth <= 768 ? 2 : 4;
    }

    let itemsPerPage = getItemsPerPage();
    let currentPage = 1;

    function updateTotalPages() {
        const totalPages = Math.ceil(trendingClubs.length / itemsPerPage);
        totalPagesSpan.textContent = totalPages;
        return totalPages;
    }

    let totalPages = updateTotalPages();

    function updatePagination() {
        currentPageSpan.textContent = currentPage;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    function displayClubs(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageClubs = trendingClubs.slice(start, end);

        trendingList.innerHTML = pageClubs.map(club => `
            <div class="trending-item">
                <div class="trending-item-header">
                    <div class="trending-item-icon">${club.icon}</div>
                    <div class="trending-item-name">${club.name}</div>
                </div>
                <div class="trending-item-desc">${club.description}</div>
                <div class="trending-item-stats">
                    <span>👥 ${club.members} members</span>
                    <span>💎 ${club.volume} volume</span>
                </div>
            </div>
        `).join('');
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayClubs(currentPage);
            updatePagination();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayClubs(currentPage);
            updatePagination();
        }
    });

    // Listen for window resize
    window.addEventListener('resize', () => {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            totalPages = updateTotalPages();
            // Ensure current page is within new total pages range
            currentPage = Math.min(currentPage, totalPages);
            displayClubs(currentPage);
            updatePagination();
        }
    });

    // Initial display
    displayClubs(currentPage);
    updatePagination();
}

async function checkDomainStatus(domain) {
    try {
        const response = await fetch(`/api/check-domain?domain=${domain}`);
        const data = await response.json();
        return data.isRegistered;
    } catch (error) {
        console.error('Error checking domain status:', error);
        return false;
    }
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

function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking menu items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Toggle button logic
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get current selected type
            const selectedType = this.getAttribute('data-type');
            
            // Here you can add logic to filter content based on type
            filterClubsByType(selectedType);
        });
    });
});

// Function to filter clubs by type
function filterClubsByType(type) {
    console.log('Filtering clubs by type:', type);
    // TODO: Implement filtering logic
    // Here you can filter and display different clubs based on type
}

// Connect wallet button click handler
document.querySelector('.connect-wallet-btn').addEventListener('click', async () => {
    try {
        const connectButton = document.querySelector('.connect-wallet-btn');
        connectButton.textContent = 'Connecting...';
        
        // Connect wallet
        const { address } = await walletKit.connect();
        
        // Update button to show address
        if (address) {
            const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
            connectButton.textContent = shortAddress;
        }
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        document.querySelector('.connect-wallet-btn').textContent = 'Connect Wallet';
    }
});