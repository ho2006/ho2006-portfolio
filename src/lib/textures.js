import { CanvasTexture } from "three";

export function keyboardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e1e4e8";
  ctx.font = "25px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const rows = [
    [
      "esc",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
      "⏏",
    ],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
    ["⇥", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["⇪", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "↵", "↵"],
    ["⇧", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "⇧", "↑", "→"],
  ];
  rows.forEach((row, y) =>
    row.forEach((key, x) => ctx.fillText(key, x * 100 + 50, y * 100 + 50)),
  );
  return new CanvasTexture(canvas);
}
