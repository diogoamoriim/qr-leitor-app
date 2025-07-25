import jsQR from "jsqr";

const fileInput = document.getElementById("fileInput");
const cameraBtn = document.getElementById("cameraBtn");
const video = document.getElementById("video");
const qrResult = document.getElementById("qr-result");

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    handleQRCode(code?.data);
  };
});

//abre a câmera para leitura de QR Code
cameraBtn.addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("A câmera não é suportada neste navegador.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          handleQRCode(code.data);
          stream.getTracks().forEach(track => track.stop());
        }
      }
      requestAnimationFrame(scan);
    };
    scan();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
});

function handleQRCode(data) {
  if (!data) {
    alert("QR Code inválido ou não detectado.");
    return;
  }

  qrResult.innerText = "Conteúdo do QR Code: " + data;

  if (data.startsWith("http")) {
    window.open(data, "_blank");
  } else if (data.includes("br.gov.bcb.pix")) {
    const match = data.match(/(br\.gov\.bcb\.pix[^\s]*)/i);
    if (match) {
      window.location.href = "https://" + match[1];
    } else {
      alert("QR Pix detectado, mas link não encontrado.");
    }
  } else {
    alert("QR Code não contém um link válido.");
  }
}
