document.addEventListener('DOMContentLoaded', function () {
    const chatInput = document.getElementById('chat-input');
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const memorySwitch = document.getElementById('memory-switch');
    const memoryLabel = document.getElementById('memory-label');
    let panelsOpened = false;

    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            if (!panelsOpened) {
                leftPanel.classList.add('open');
                rightPanel.classList.add('open');
                panelsOpened = true;
            }
            // Placeholder: handle chat message
            chatInput.value = '';
        }
    });

    memorySwitch.addEventListener('change', function () {
        if (memorySwitch.checked) {
            memoryLabel.textContent = 'Memory ON';
            memoryLabel.style.color = '#00ff41';
        } else {
            memoryLabel.textContent = 'Memory OFF';
            memoryLabel.style.color = '#e0e0e0';
        }
    });
});
