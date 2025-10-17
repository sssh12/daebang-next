export function getPixelClusters(properties, mapInstance, pixelDistance = 44) {
  if (!mapInstance || !window.kakao?.maps)
    return properties.map((item) => [item]);
  const proj = mapInstance.getProjection();
  const projected = properties.map((item) => {
    const point = proj.pointFromCoords(
      new window.kakao.maps.LatLng(item.lat, item.lng)
    );
    return { ...item, _point: point };
  });
  const clusters = [];
  const visited = new Array(projected.length).fill(false);

  for (let i = 0; i < projected.length; i++) {
    if (visited[i]) continue;
    const cluster = [projected[i]];
    visited[i] = true;
    for (let j = i + 1; j < projected.length; j++) {
      if (visited[j]) continue;
      const dx = projected[i]._point.x - projected[j]._point.x;
      const dy = projected[i]._point.y - projected[j]._point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pixelDistance) {
        cluster.push(projected[j]);
        visited[j] = true;
      }
    }
    clusters.push(cluster);
  }
  return clusters;
}
