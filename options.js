document.addEventListener('DOMContentLoaded', () => {
    const configForm = document.getElementById('configForm');
    const saveButton = document.getElementById('saveButton');

    // Load saved configuration from chrome storage
    chrome.storage.local.get('config', (data) => {
        if (data.config) {
            const selectedRadio = configForm.querySelector(`input[value="${data.config}"]`);
            if (selectedRadio) {
                selectedRadio.checked = true;
            }
        }
        else {
            const selectedRadio = configForm.querySelector(`input[value="plain"]`);
            if (selectedRadio) {
                selectedRadio.checked = true;
            }
        }
    });

    // Save configuration to chrome storage
    saveButton.addEventListener('click', () => {
        const selectedConfig = configForm.config.value;
        chrome.storage.local.set({ config: selectedConfig }, () => {
            document.getElementById("sib_saved").innerText = "Tone saved!";
            setTimeout(() => {
                window.close();
            }, "600");
        });
    });
});

