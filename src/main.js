
// Estrutura básica da interface
document.getElementById('app').innerHTML = `
  <input type="file" id="fileInput" accept="image/*">
  <video id="video" autoplay muted></video>
  <canvas id="canvas" style="display:none;"></canvas>
  <p id="result"></p>
`;

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Lógica de detecção virá aqui
    document.getElementById('result').innerText = "Imagem carregada. Detecção em desenvolvimento.";
  }
});
