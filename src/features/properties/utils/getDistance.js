export function getDistance(deptLat, deptLng, listingLat, listingLng) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(listingLat - deptLat);
  const dLng = toRad(listingLng - deptLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(deptLat)) *
      Math.cos(toRad(listingLat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
