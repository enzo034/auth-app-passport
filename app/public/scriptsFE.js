function removeQR() {
    const qrCode = document.getElementById('qrCode');
    if (qrCode) {
        qrCode.remove();
    }
}

setTimeout(() => {
    const message2fa = document.getElementById('message2fa');
    if (message2fa) {
        message2fa.remove();
    }
}, 5000);