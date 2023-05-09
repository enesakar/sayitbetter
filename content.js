let popup;

function createDiv(text) {
    if (text) {
        popup = document.createElement('div');
        popup.style.width = 'auto';
        popup.style.height = 'auto';
        popup.style.background = 'rgba(0, 0, 0, 0.7)';
        popup.style.color = 'white';
        popup.style.padding = '25px';
        popup.style.borderRadius = '5px';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = '9999';

        const closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "0";
        closeButton.style.color = 'white';
        closeButton.style.right = "0";
        closeButton.style.border = "none";
        closeButton.style.background = "none";
        closeButton.style.padding = "10";
        closeButton.style.margin = "10";
        closeButton.style.fontSize = "18px";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = removePopup;

        const content = document.createElement("div");
        content.id = "sayitbetter_popup";
        content.style.whiteSpace = "pre";
        content.innerText = text;

        // popup.appendChild(closeButton);
        popup.appendChild(content);
        document.body.appendChild(popup);

        // Remove the div when clicked
        popup.addEventListener('click', () => {
            removePopup();
        });
    }
}

function removePopup() {
    if (popup) {
        popup.remove();
        popup = null;
    }
}

function updateDiv(text) {
    if (text) {
        const newDiv = document.getElementById('sayitbetter_popup');
        newDiv.textContent = text;

        setTimeout(() => {
            removePopup();
        }, "1000");
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'createDiv') {
        createDiv(message.text);
    }
    if (message.action === 'updateDiv') {
        updateDiv(message.text);
    }
});
