// Assuming Html5QrcodeScanner is properly included in your HTML via script tag
const scanner = new Html5QrcodeScanner("reader", { fps: 30, qrbox: 250 });
scanner.render(onScanSuccess, onScanFailure);

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    const encodedCollectionName = encodeURIComponent(decodedText);
    console.log(`Fetching data for collection: ${decodedText}`);

    fetch(`/search?collection_name=${encodedCollectionName}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Received data:", data);
        if (data.alert === "error") {
            console.log("Error:", data.error);
            showPopup(data.error);
        } else if (data.data.qrData && data.data.qrData.status === "enabled") { // Corrected access to status
            localStorage.setItem('qrData', JSON.stringify(data.data.qrData)); // Ensure you're storing the qrData
            window.location.href = 'kunjor.html';
        } else {
            showPopup("Collection not approved yet.");
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        showPopup('Error fetching data.');
    });

    scanner.clear();
}


function onScanFailure(error) {
    // Warn about scan failure errors
    console.warn(`Code scan error = ${error}`);
}

function showPopup(message) {
    // Display a popup with a message
    var popupMessage = document.getElementById('popup-message');
    if (popupMessage) {
        popupMessage.textContent = message;
        document.getElementById('popup').style.display = 'block';
    } else {
        console.error('Popup message element not found');
    }
}

function closePopup() {
    // Close the popup and reload the page to reset state
    window.location.reload();
}
