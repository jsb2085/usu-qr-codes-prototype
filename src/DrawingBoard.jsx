import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const UploadedImage = ({ src, x, y, draggable }) => {
  const [img] = useImage(src);
  return <KonvaImage image={img} x={x} y={y} draggable={draggable} />;
};

const DrawingBoard = ({ qrCodeSrc }) => {
  const stageRef = useRef();
  const [elements, setElements] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");

  const textareaRef = useRef();

  const addText = () => {
    setElements([
      ...elements,
      {
        type: "text",
        id: `text-${elements.length}`,
        x: 150,
        y: 150,
        text: "Click to edit",
        fontSize: 20,
        draggable: true,
      },
    ]);
  };

  const addQRCode = () => {
    setElements([
      ...elements,
      {
        type: "image",
        id: `qr-${elements.length}`,
        src: qrCodeSrc,
        x: 200,
        y: 200,
        draggable: true,
      },
    ]);
  };

  const handleTextClick = (e, index) => {
    const shape = e.target;
    const absPos = shape.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();

    setEditingIndex(index);
    setTextPosition({
      x: absPos.x + stageBox.left,
      y: absPos.y + stageBox.top + 585,
    });
    setTextValue(elements[index].text);
  };

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleTextBlur = () => {
    const updated = [...elements];
    updated[editingIndex].text = textValue;
    setElements(updated);
    setEditingIndex(null);
  };

  return (
    <div>
      <button onClick={addText}>Add Text</button>
      <button onClick={addQRCode}>Add QR Code</button>

      <Stage
        width={1000}
        height={600}
        ref={stageRef}
        style={{ border: "1px solid black", marginTop: "10px" }}
      >
        <Layer>
          {elements.map((el, i) => {
            if (el.type === "text") {
              return (
                <Text
                  key={el.id}
                  {...el}
                  onClick={(e) => handleTextClick(e, i)}
                />
              );
            }
            if (el.type === "image") {
              return (
                <UploadedImage
                  key={el.id}
                  src={el.src}
                  x={el.x}
                  y={el.y}
                  draggable={el.draggable}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>

      {editingIndex !== null && (
        <textarea
          ref={textareaRef}
          style={{
            position: "absolute",
            top: textPosition.y,
            left: textPosition.x,
            fontSize: elements[editingIndex]?.fontSize || 20,
            border: "1px solid gray",
            padding: "2px",
            background: "white",
            fontFamily: "sans-serif",
          }}
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          autoFocus
        />
      )}
    </div>
  );
};

export default DrawingBoard;