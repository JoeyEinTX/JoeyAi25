document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatInput = document.getElementById('chatInput');
    const memorySwitch = document.getElementById('memorySwitch');
    const memoryLabel = document.getElementById('memoryLabel');
    const leftPanel = document.getElementById('leftPanel');
    const rightPanel = document.getElementById('rightPanel');
    const mainContainer = document.getElementById('mainContainer');
    const background = document.getElementById('background');
    const memoryContent = document.getElementById('memoryContent');
    const systemContent = document.getElementById('systemContent');

    // State
    let firstMessageSent = false;
    let isTransitioning = false;

    // Initialize
    chatInput.focus();
    populateInitialContent();

    // Chat input event listener
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && chatInput.value.trim() !== '' && !isTransitioning) {
            const message = chatInput.value.trim();
            
            if (!firstMessageSent) {
                wakeCockpitOnce();
                triggerCinematicTransition();
                firstMessageSent = true;
            }
            
            processMessage(message);
            chatInput.value = '';
        }
    });

    // Wake cockpit function - triggers engaged state
    function wakeCockpitOnce() {
        if (!document.body.classList.contains('engaged')) {
            document.body.classList.add('engaged');
            console.log('🚀 Cockpit engaged - UI transitioning to active state');
            console.log('Body classes:', document.body.className);
            
            // Debug: Check panel visibility after a delay
            setTimeout(() => {
                console.log('Left panel classes:', leftPanel.className);
                console.log('Right panel classes:', rightPanel.className);
                console.log('Left panel transform:', window.getComputedStyle(leftPanel).transform);
                console.log('Right panel transform:', window.getComputedStyle(rightPanel).transform);
            }, 1000);
        }
    }

    // Memory switch toggle
    memorySwitch.addEventListener('change', function() {
        if (memorySwitch.checked) {
            memoryLabel.textContent = 'Memory ON';
            memoryLabel.style.color = '#00ff41';
        } else {
            memoryLabel.textContent = 'Memory OFF';
            memoryLabel.style.color = 'rgba(0, 255, 65, 0.5)';
        }
        
        // Add flicker effect
        memoryLabel.classList.add('matrix-text');
        setTimeout(() => {
            memoryLabel.classList.remove('matrix-text');
        }, 2000);
    });

    // Cinematic transition function
    function triggerCinematicTransition() {
        if (isTransitioning) return;
        isTransitioning = true;

        console.log('🎬 Initiating cinematic sequence...');

        // Blur background
        setTimeout(() => {
            background.classList.add('blurred');
        }, 100);

        // Scale up main container
        setTimeout(() => {
            mainContainer.classList.add('focused');
        }, 300);

        // Show left panel first
        setTimeout(() => {
            leftPanel.classList.add('active');
            populateMemoryContent();
        }, 600);

        // Show right panel with delay for staggered effect
        setTimeout(() => {
            rightPanel.classList.add('active');
            populateSystemContent();
        }, 900);

        // Complete transition
        setTimeout(() => {
            isTransitioning = false;
            console.log('✨ Cinematic sequence complete');
        }, 2100);
    }

    // Process message
    async function processMessage(message) {
        console.log('Processing:', message);
        
        // Add user message immediately
        appendMessage('user', message);
        
        // Send to backend API
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: message, 
                    memory_enabled: memorySwitch.checked 
                })
            });
            
            const data = await response.json();
            console.log('Backend response:', data);
            
            // Add assistant reply
            appendMessage('assistant', data.reply || '(no reply)');
            
        } catch (error) {
            console.error('Chat API error:', error);
            appendMessage('assistant', '(Error reaching backend)');
        }
        
        // Add to memory if body is engaged (panels are visible)
        if (document.body.classList.contains('engaged')) {
            addMessageToMemory(message);
        }
        
        // Update system monitor
        if (document.body.classList.contains('engaged')) {
            updateSystemMonitor();
        }
    }

    // Append message to chat area
    function appendMessage(role, text) {
        const messageHistory = document.getElementById('messageHistory');
        if (messageHistory) {
            const messageElement = document.createElement('p');
            messageElement.style.opacity = '0.9';
            messageElement.style.marginTop = '0.5rem';
            messageElement.style.color = role === 'user' ? '#00ff41' : '#ffffff';
            messageElement.innerHTML = `[${role.toUpperCase()}] ${text}`;
            messageHistory.appendChild(messageElement);
            
            // Scroll to bottom
            memoryContent.scrollTop = memoryContent.scrollHeight;
        }
    }

    // Populate initial content
    function populateInitialContent() {
        memoryContent.innerHTML = `
            <div class="matrix-text">
                <p>[SYSTEM] Memory core initialized</p>
                <p>[STATUS] Awaiting first interaction...</p>
            </div>
        `;

        systemContent.innerHTML = `
            <div class="matrix-text">
                <p>[AI_CORE] Status: ONLINE</p>
                <p>[MEMORY] Status: STANDBY</p>
                <p>[RESPONSE] Latency: < 50ms</p>
            </div>
        `;
    }

    // Populate memory content after activation
    function populateMemoryContent() {
        memoryContent.innerHTML = `
            <div class="matrix-text">
                <p>[SYSTEM] Memory core activated</p>
                <p>[STATUS] Recording conversation...</p>
                <p>[TIMESTAMP] ${new Date().toLocaleTimeString()}</p>
                <br>
                <div id="messageHistory">
                    <p style="opacity: 0.7;">[LOG] Session initiated</p>
                </div>
            </div>
        `;
    }

    // Populate system content after activation
    function populateSystemContent() {
        systemContent.innerHTML = `
            <div class="matrix-text">
                <p>[AI_CORE] Status: ACTIVE</p>
                <p>[MEMORY] Status: RECORDING</p>
                <p>[RESPONSE] Latency: < 30ms</p>
                <p>[NEURAL_NET] Confidence: 98.7%</p>
                <br>
                <div id="systemStats">
                    <p style="opacity: 0.7;">[UPTIME] ${Math.floor(Math.random() * 1000)}ms</p>
                    <p style="opacity: 0.7;">[QUERIES] 1</p>
                </div>
            </div>
        `;
    }

    // Add message to memory panel
    function addMessageToMemory(message) {
        const messageHistory = document.getElementById('messageHistory');
        if (messageHistory) {
            const messageElement = document.createElement('p');
            messageElement.style.opacity = '0.9';
            messageElement.style.marginTop = '0.5rem';
            messageElement.innerHTML = `[USER] ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`;
            messageHistory.appendChild(messageElement);
            
            // Scroll to bottom
            memoryContent.scrollTop = memoryContent.scrollHeight;
        }
    }

    // Update system monitor
    function updateSystemMonitor() {
        const systemStats = document.getElementById('systemStats');
        if (systemStats) {
            const queries = systemStats.children.length;
            systemStats.innerHTML = `
                <p style="opacity: 0.7;">[UPTIME] ${Math.floor(Math.random() * 5000)}ms</p>
                <p style="opacity: 0.7;">[QUERIES] ${queries + 1}</p>
                <p style="opacity: 0.7;">[CPU] ${Math.floor(Math.random() * 30 + 20)}%</p>
            `;
        }
    }

    // Add typing effect to input
    chatInput.addEventListener('input', function() {
        if (chatInput.value.length > 0) {
            chatInput.style.textShadow = '0 0 5px #00ff41';
        } else {
            chatInput.style.textShadow = 'none';
        }
    });

    // Matrix rain effect for panels (subtle)
    function createMatrixEffect(element) {
        const chars = '01';
        let interval = setInterval(() => {
            if (!document.body.classList.contains('engaged')) {
                clearInterval(interval);
                return;
            }
            
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            const span = document.createElement('span');
            span.textContent = randomChar;
            span.style.position = 'absolute';
            span.style.color = 'rgba(0, 255, 65, 0.3)';
            span.style.fontSize = '0.8rem';
            span.style.left = Math.random() * 100 + '%';
            span.style.animation = 'matrixFall 2s linear forwards';
            
            element.style.position = 'relative';
            element.appendChild(span);
            
            setTimeout(() => {
                if (span.parentNode) {
                    span.parentNode.removeChild(span);
                }
            }, 2000);
        }, 200);
    }

    // Add matrix fall animation
    const matrixStyle = document.createElement('style');
    matrixStyle.textContent = `
        @keyframes matrixFall {
            from {
                top: -20px;
                opacity: 1;
            }
            to {
                top: 100%;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(matrixStyle);

    // Start matrix effects when body becomes engaged
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target === document.body && target.classList.contains('engaged')) {
                    // Start matrix effects on both panels after a delay
                    setTimeout(() => {
                        createMatrixEffect(leftPanel);
                        createMatrixEffect(rightPanel);
                    }, 1000);
                }
            }
        });
    });

    observer.observe(document.body, { attributes: true });

    console.log('🤖 JoeyAi initialized - Ready for interaction');
});
