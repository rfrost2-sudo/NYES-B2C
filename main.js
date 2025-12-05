document.addEventListener('DOMContentLoaded', () => {

    // --- State & Data --- //

    // Sample product data, mimicking a products.json file
    const products = [
        {
            id: 'G001',
            name: 'AAMI Level 2 Isolation Gown',
            price: '$12.50',
            description: 'Fluid-resistant, non-sterile gown for low-risk situations. Made in USA.',
            image: 'https://picsum.photos/seed/gown/400/400'
        },
        {
            id: 'M002',
            name: 'NIOSH N95 Respirator Mask',
            price: '$2.80',
            description: 'Filters at least 95% of airborne particles. Comfortable and secure fit.',
            image: 'https://picsum.photos/seed/mask/400/400'
        },
        {
            id: 'L003',
            name: 'Nitrile Examination Gloves',
            price: '$0.45 / pair',
            description: 'Latex-free, powder-free gloves with excellent tactile sensitivity.',
            image: 'https://picsum.photos/seed/gloves/400/400'
        },
        {
            id: 'S004',
            name: 'Disposable Face Shield',
            price: '$5.00',
            description: 'Full-face protection against splashes and sprays. Anti-fog and optically clear.',
            image: 'https://picsum.photos/seed/shield/400/400'
        }
    ];

    let cart = [];

    // --- DOM Elements --- //
    const catalogGrid = document.getElementById('catalog-grid');
    
    const askProcurementBtn = document.getElementById('ask-procurement-btn');
    const chatPanel = document.getElementById('chat-panel');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatQuestionInput = document.getElementById('chat-question');
    const chatConversation = document.getElementById('chat-conversation');

    const cartModal = document.getElementById('cart-modal');
    const closeCartModalBtn = document.getElementById('close-cart-modal-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const generateJustificationBtn = document.getElementById('generate-justification-btn');

    const contactForm = document.getElementById('contact-form');

    // --- Functions --- //

    /**
     * Renders product cards into the catalog grid.
     */
    function renderProducts() {
        if (!catalogGrid) return;
        catalogGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="card-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-content">
                    <div class="product-tag">New Arrival</div>
                    <h3>${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-footer">
                        <span class="price">${product.price}</span>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Bag</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Toggles the visibility of the chat panel.
     */
    function toggleChatPanel() {
        chatPanel.classList.toggle('open');
    }

    /**
     * Mocks a call to a procurement API.
     * @param {string} question The user's question.
     */
    function askProcurement(question) {
        if (!question.trim()) return;

        // Display user's question
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `<div class="message-content"><p>${question}</p></div>`;
        chatConversation.appendChild(userMessage);

        // Display loading indicator
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'chat-message bot loading';
        loadingMessage.innerHTML = `
            <div class="message-content"><p style="color:#888; font-style:italic;">Analyzing docs...</p></div>
        `;
        chatConversation.appendChild(loadingMessage);
        chatConversation.scrollTop = chatConversation.scrollHeight;

        // Mock API call with setTimeout
        setTimeout(() => {
            const answer = "Based on our documentation, all our N95 masks are NIOSH-approved under approval number TC-84A-XXXX. They are manufactured at our facility in Cleveland, Ohio, ensuring compliance with all relevant U.S. standards.";
            const sources = "Doc 4.2 §1.3, Compliance Sheet B §5";

            loadingMessage.classList.remove('loading');
            loadingMessage.innerHTML = `
                <div class="message-content">
                    <p>${answer}</p>
                    <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(0,0,0,0.05); font-size:0.75rem; color:#666;">
                        <strong>Source:</strong> ${sources}
                    </div>
                </div>
            `;
            chatConversation.scrollTop = chatConversation.scrollHeight;
        }, 1500);

        chatQuestionInput.value = '';
    }
    
    /**
     * Adds a product to the cart and shows the confirmation modal.
     * @param {string} productId The ID of the product to add.
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push(product);
            console.log('Cart updated:', cart);
            updateCartModal();
            cartModal.hidden = false;
        }
    }
    
    /**
     * Updates the content of the cart modal.
     */
    function updateCartModal() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--color-text-secondary); padding: 1rem;">Your cart is empty.</p>';
        } else {
            const itemCounts = cart.reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + 1;
                return acc;
            }, {});
            
            cartItemsContainer.innerHTML = Object.entries(itemCounts).map(([name, count]) => 
                `<div class="cart-item">
                    <span style="font-weight:500; color:var(--color-text-main); font-size:0.95rem;">${name}</span>
                    <span class="cart-item-badge">x${count}</span>
                </div>`
            ).join('');
        }
    }

    /**
     * Mocks the generation of a purchase justification document.
     * @param {Array} cartContents The current items in the cart.
     * @param {object} buyerContext Mock context about the buyer.
     */
    function generateJustification(cartContents, buyerContext) {
        if (cartContents.length === 0) {
            alert('Your cart is empty. Add items before generating a justification.');
            return;
        }
        console.log("--- Generating Justification ---");
        console.log("Buyer Context:", buyerContext);
        console.log("Cart Items:", cartContents);
        
        alert(`Justification generation initiated for ${cartContents.length} item(s). Check the console for details.`);
        cartModal.hidden = true;
    }


    // --- Event Listeners --- //

    // Product Catalog
    if (catalogGrid) {
        catalogGrid.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-btn')) {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            }
        });
    }

    // Chat Panel
    if (askProcurementBtn) askProcurementBtn.addEventListener('click', toggleChatPanel);
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChatPanel);
    if (sendChatBtn) sendChatBtn.addEventListener('click', () => askProcurement(chatQuestionInput.value));
    if (chatQuestionInput) {
        chatQuestionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                askProcurement(chatQuestionInput.value);
            }
        });
    }

    // Cart Modal
    if (closeCartModalBtn) closeCartModalBtn.addEventListener('click', () => cartModal.hidden = true);
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) { // Click on overlay background
                cartModal.hidden = true;
            }
        });
    }
    if (generateJustificationBtn) {
        generateJustificationBtn.addEventListener('click', () => {
            const mockContext = { userId: 'proc-123', department: 'Clinical Operations' };
            generateJustification(cart, mockContext);
        });
    }

    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Contact form submitted:', data);
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });
    }


    // --- Initialization --- //
    renderProducts();

});