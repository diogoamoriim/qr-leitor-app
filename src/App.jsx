import React, { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import "./App.css";

export default function App() {
  const [qrText, setQrText] = useState("");
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  const iniciarLeituraCamera = () => {
    setCameraAtiva(true);
    scannerRef.current = new QrScanner(
      videoRef.current,
      (result) => {
        setQrText(result.data);
        pararLeituraCamera();
      },
      { returnDetailedScanResult: true }
    );
    scannerRef.current.start();
  };

  const pararLeituraCamera = () => {
    setCameraAtiva(false);
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
  };

  const handleArquivoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        setQrText(result.data || result);
      } catch (error) {
        alert("Não foi possível ler o QR Code da imagem.");
      }
    }
  };

  const abrirLink = () => {
    if (qrText.startsWith("http")) {
      window.open(qrText, "_blank");
    } else {
      alert("QR Code não contém um link válido.");
    }
  };

  useEffect(() => {
    return () => pararLeituraCamera();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 gap-6">
      <h1 className="text-3xl font-bold text-center">Leitor de QR Code</h1>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleArquivoUpload}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={iniciarLeituraCamera}
          disabled={cameraAtiva}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Ler com a Câmera
        </button>
        {cameraAtiva && <video ref={videoRef} className="w-full rounded border" />}
        {qrText && (
          <div className="space-y-2">
            <p className="break-words text-sm">Conteúdo do QR Code: {qrText}</p>
            <button
              onClick={abrirLink}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Seguir o caminho
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
