const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  external: "M7 17 17 7M7 7h10v10",
  github:
    "M9 19c-4 1-4-2-6-2m12 4v-3.4c0-.9-.3-1.5-.7-1.9 2.8-.3 5.7-1.4 5.7-6.2a4.8 4.8 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.3s-1-.3-3.5 1.3a12 12 0 0 0-6.2 0C5.5 2.3 4.5 2.6 4.5 2.6a4.4 4.4 0 0 0-.1 3.3A4.8 4.8 0 0 0 3 9.2c0 4.8 2.9 5.9 5.7 6.2-.4.4-.7 1-.7 1.9V21",
  monitor: "M3 4h18v13H3zM8 21h8m-4-4v4",
  folder: "M3 7V4h6l3 3h9v13H3z",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z",
  mail: "M3 5h18v14H3zM3 5l9 8 9-8",
  user: "M20 21v-2a8 8 0 0 0-16 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  award: "M8 13 6 22l6-3 6 3-2-9M19 8A7 7 0 1 1 5 8a7 7 0 0 1 14 0",
  code: "m8 5-7 7 7 7m8-14 7 7-7 7m-3-16-2 18",
  rotate: "M3 10a9 9 0 1 1 2 8M3 3v7h7",
  chevron: "m9 5 7 7-7 7",
  check: "m5 12 4 4L19 6",
  copy: "M8 8h13v13H8zM16 8V3H3v13h5",
  close: "m6 6 12 12M6 18 18 6",
};

export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.code} />
    </svg>
  );
}
