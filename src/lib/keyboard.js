export const keyboardWidth = 5.55;
export const keyboardDepth = 1.92;
export const keyboardCenterZ = -0.61;

const rows = [
  ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "eject"],
  ["~\n`", "!\n1", "@\n2", "#\n3", "$\n4", "%\n5", "^\n6", "&\n7", "*\n8", "(\n9", ")\n0", "_\n-", "+\n=", ["delete", 2]],
  [["tab", 1.5], "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{\n[", "}\n]", ["|\n\\", 1.5]],
  [["caps lock", 1.75], "A", "S", "D", "F", "G", "H", "J", "K", "L", ":\n;", '"\n\'', ["return", 2.25]],
  [["shift", 2.25], "Z", "X", "C", "V", "B", "N", "M", "<\n,", ">\n.", "?\n/", ["shift", 2.75]],
  ["fn", "control", ["option", 1.25], ["command", 1.25], ["space", 5], ["command", 1.25], ["option", 1.25]],
];

export const keyboardKeys = rows.flatMap((row, rowIndex) => {
  let offset = 0;
  return row.map((entry) => {
    const [label, units] = Array.isArray(entry)
      ? entry
      : [entry, rowIndex === 0 ? 15 / 14 : 1];
    const key = {
      label,
      x: (offset + units / 2) * 0.37 - keyboardWidth / 2,
      z: -1.4 + rowIndex * 0.32,
      width: units * 0.37 - 0.035,
      depth: rowIndex === 0 ? 0.18 : 0.265,
    };
    offset += units;
    return key;
  });
});

keyboardKeys.push(
  { label: "left", x: 1.85, z: 0.255, width: 0.335, depth: 0.115 },
  { label: "up", x: 2.22, z: 0.105, width: 0.335, depth: 0.115 },
  { label: "down", x: 2.22, z: 0.255, width: 0.335, depth: 0.115 },
  { label: "right", x: 2.59, z: 0.255, width: 0.335, depth: 0.115 },
);
