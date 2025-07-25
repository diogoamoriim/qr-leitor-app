
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
            resultText.innerText = "QR Detectado: " + code.data;
            clearInterval(scanInterval);
            window.open(code.data, "_blank");
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
      resultText.innerText = "QR Detectado: " + code.data;
      window.open(code.data, "_blank");
    } else {
      resultText.innerText = "Nenhum QR Code detectado.";
    }
  }
});
