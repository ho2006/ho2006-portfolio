export function fitDistance(width, height, aspect, fov, fill = 0.86) {
  return (
    Math.max(height, width / aspect) /
    (2 * Math.tan((fov * Math.PI) / 360) * fill)
  );
}
