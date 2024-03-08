document.addEventListener('DOMContentLoaded', function () {
    const qrCodeForm = document.getElementById('qrCodeForm');
    const qrCodeImage = document.getElementById('qrCodeImage');
  
    qrCodeForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const formData = new FormData(qrCodeForm);
      const username = formData.get('user');
  
      try {
        const response = await fetch(`/generateQR?user=${username}`);
        const data = await response.json();
  
        if (response.ok) {
          qrCodeImage.innerHTML = `<img src="${data.image}" alt="QR Code">`;
        } else {
          console.error(data.error);
          qrCodeImage.innerHTML = `<p>Error: ${data.error}</p>`;
        }
      } catch (error) {
        console.error('Error:', error.message);
        qrCodeImage.innerHTML = '<p>Error: Internal Server Error</p>';
      }
    });
  });
  