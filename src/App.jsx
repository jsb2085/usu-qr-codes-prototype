import { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import  DrawingBoard  from "./DrawingBoard"
import "./App.css";

const COLORS = {
  aggie: "#0F2439",
  black: "#000000",
  gray: "#A2AAAD",
  white: "#FFFFFF",
  electric: "#01ADD8",
};

const groupedLogos = [
  {
    color: "Aggie Blue",
    items: ["QRCode_UState_AggieBlue.png", "QRCode_BlockA_AggieBlue.png"],
  },
  {
    color: "Black",
    items: ["QRCode_UState_Black.png", "QRCode_BlockA_Black.png"],
  },
  {
    color: "White_Aggie",
    items: ["QRCode_UState_White_Aggie.png", "QRCode_BlockA_White_Aggie.png"],
  },
  {
    color: "White_Black",
    items: ["QRCode_UState_White_Black.png", "QRCode_BlockA_White_Black.png"],
  },
];

export default function App() {
  const [url, setUrl] = useState("");
  const [colorOption, setColorOption] = useState("aggie");
  const [useGradient, setUseGradient] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState("");
  const [backgroundChoice, setBackgroundChoice] = useState("aggie");

  const qrRef = useRef(null);
  const qrCodeRef = useRef(
    new QRCodeStyling({
      width: 256,
      height: 256,
      type: "canvas",
      data: "https://usu.edu",
      image: "",
      imageOptions: {
        crossOrigin: "anonymous",
        excavate: true,
      },
      dotsOptions: {
        color: COLORS.aggie,
        type: "rounded",
      },
      backgroundOptions: {
        color: COLORS.white,
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
    })
  );

  useEffect(() => {
    if (qrRef.current && qrRef.current.childNodes.length === 0) {
      qrCodeRef.current.append(qrRef.current);
      qrCodeRef.current.update({ data: url || "https://usu.edu" });
    }
  }, []);

  useEffect(() => {
    if (!qrRef.current) return;

    qrRef.current.innerHTML = "";

    const qrColor = useGradient ? COLORS.aggie : COLORS[colorOption];
    const bgColor =
      (colorOption === "white" || colorOption === "gray") && !useGradient
        ? COLORS[backgroundChoice]
        : COLORS.white;

    const newQrCode = new QRCodeStyling({
      width: 256,
      height: 256,
      type: "canvas",
      data: url || "https://usu.edu",
      image: selectedLogo ? `/qr-logos/${selectedLogo}` : "",
      imageOptions: {
        crossOrigin: "anonymous",
        excavate: true,
      },
      dotsOptions: useGradient
        ? {
            type: "rounded",
            gradient: {
              type: "linear",
              rotation: 0,
              colorStops: [
                { offset: 0, color: COLORS.aggie },
                { offset: 1, color: COLORS.electric },
              ],
            },
          }
        : {
            type: "rounded",
            color: COLORS[colorOption],
          },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
    });

    newQrCode.append(qrRef.current);
    qrCodeRef.current = newQrCode;
  }, [url, selectedLogo, colorOption, useGradient, backgroundChoice]);

  const downloadQR = () => {
    qrCodeRef.current.download({ name: "usu-qr-code", extension: "png" });
  };

  return (
    <div className="container">
      <h1 className="title">USU Branded QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter URL (must start with https://)"
        className="input"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="section">
        <label className="label">One-Color Options:</label>
        <div className="swatch-grid">
          {["aggie", "gray", "black", "white"].map((color) => (
            <div
              key={color}
              className={`swatch ${
                colorOption === color && !useGradient ? "selected" : ""
              }`}
              style={{
                backgroundColor: COLORS[color],
                border:
                  colorOption === color && !useGradient
                    ? "2px solid black"
                    : "2px solid grey",
              }}
              onClick={() => {
                setUseGradient(false);
                setColorOption(color);
              }}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
            />
          ))}
        </div>
      </div>

      {(colorOption === "white" || colorOption === "gray") &&
        !useGradient && (
          <div className="section">
            <label className="label">Background Color:</label>
            <div className="swatch-grid">
              {["aggie", "black"].map((bg) => (
                <div
                  key={bg}
                  className={`swatch ${
                    backgroundChoice === bg ? "selected" : ""
                  }`}
                  style={{
                    backgroundColor: COLORS[bg],
                    border:
                      backgroundChoice === bg
                        ? "2px solid black"
                        : "2px solid grey",
                  }}
                  onClick={() => setBackgroundChoice(bg)}
                  title={bg.charAt(0).toUpperCase() + bg.slice(1)}
                />
              ))}
            </div>
          </div>
        )}

      <div className="section">
        <label className="label">Gradient Color Options:</label>
        <div
          className={`swatch gradient ${useGradient ? "selected" : ""}`}
          style={{
            background: "linear-gradient(to bottom, #0F2439, #01ADD8)",
            border: useGradient ? "2px solid black" : "2px solid grey",
          }}
          onClick={() => setUseGradient(true)}
          title="Aggie → Electric Gradient"
        />
      </div>

      <div className="section">
        <label className="label">Logo:</label>
        <div className="logo-columns">
          {groupedLogos.map((group) => (
            <div key={group.color} className="logo-column">
              {group.items.map((logo) => (
                <div
                  key={logo}
                  className={`logo-swatch-wrapper ${
                    selectedLogo === logo ? "selected" : ""
                  }`}
                  onClick={() => setSelectedLogo(logo)}
                  title={logo
                    .replace("QRCode_", "")
                    .replace(".png", "")
                    .replace(/_/g, " ")}
                >
                  <img
                    src={`/qr-logos/${logo}`}
                    className="logo-swatch"
                    alt={logo}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="export">
        <input
        className="title"
        placeholder="Scan here for..."
        ></input>
      <div
        className="qr-wrapper"
        style={{
          backgroundColor:
            colorOption === "white" ||
            colorOption === "gray" ||
            !useGradient
              ? COLORS[backgroundChoice]
              : "white",
        }}
      >
        <div ref={qrRef}></div>
        </div>
      </div>



      <button className="download-btn" onClick={downloadQR}>
        Download QR Code
      </button>
    </div>
  );
}
