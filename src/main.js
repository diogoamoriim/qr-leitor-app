
import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultText = document.getElementById("result");

document.getElementById("abrirCamera").addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      const scanInterval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            clearInterval(scanInterval);
            handleQRCode(code.data);
          }
        }
      }, 500);
    })
    .catch(err => {
      resultText.innerText = "Erro ao acessar a câmera.";
      console.error(err);
    });
});

document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code) {
      handleQRCode(code.data);
    } else {
      resultText.innerText = "Nenhum QR Code detectado.";
    }
  }
});

function handleQRCode(data) {
  if (!data) {
    alert("QR Code inválido ou não detectado.");
    return;
  }

  resultText.innerText = "Conteúdo do QR Code: " + data;

  if (data.startsWith("http")) {
    window.open(data, "_blank");
    return;
  }

  if (data.includes("br.gov.bcb.pix") || data.includes("000201")) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = "intent://brcode#Intent;scheme=br.gov.bcb.pix;package=com.nu.production;end";
    } else {
      alert("QR Pix detectado. Por favor, use seu app bancário no celular.");
    }
    return;
  }

  if (/^\d{47,48}$/.test(data)) {
    alert("Código de barras detectado. Copie e cole no seu app bancário.");
    return;
  }

  alert("QR Code lido, mas não reconhecido como link, Pix ou boleto.");
}
