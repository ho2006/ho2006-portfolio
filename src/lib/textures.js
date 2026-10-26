import { CanvasTexture, SRGBColorSpace } from "three";
import { keyboardKeys, keyboardWidth, keyboardDepth, keyboardCenterZ } from "./keyboard.js";

export function keyboardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2220;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  const scale = canvas.width / keyboardWidth;
  ctx.fillStyle = "#f1f3f5";
  ctx.strokeStyle = "#f1f3f5";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const key of keyboardKeys) {
    const x = (key.x + keyboardWidth / 2) * scale;
    const y = (key.z - keyboardCenterZ + keyboardDepth / 2) * scale;
    if (["left", "up", "down", "right"].includes(key.label)) {
      const angle = { left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2, right: 0 }[key.label];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(9, 0);
      ctx.moveTo(3, -6);
      ctx.lineTo(9, 0);
      ctx.lineTo(3, 6);
      ctx.stroke();
      ctx.restore();
    } else if (key.label === "eject") {
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x + 10, y + 2);
      ctx.lineTo(x - 10, y + 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(x - 10, y + 7, 20, 3);
    } else if (key.label !== "space") {
      const lines = key.label.split("\n");
      const fontSize = lines.length > 1 ? 24 : key.label.length > 1 ? 20 : 30;
      ctx.font = `${fontSize}px Arial, sans-serif`;
      lines.forEach((line, index) =>
        ctx.fillText(line, x, y + (index - (lines.length - 1) / 2) * 32, key.width * scale - 12),
      );
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
