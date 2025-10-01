import { renderToStaticMarkup } from "react-dom/server";
import MarkerIcon from "@/components/MarkerIcon";
import ClusterIcon from "@/components/ClusterIcon";

export function createMarkerOverlay({
  property,
  isHighlighted,
  isHovered,
  isActive,
  onHover,
  onLeave,
  onClick,
}) {
  const scale = isActive ? 1.2 : isHovered ? 1.1 : 1;
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(
    <MarkerIcon recommended={isHighlighted} />
  );
  div.style.width = "40px";
  div.style.height = "40px";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.transition = "transform 0.2s cubic-bezier(.4,2,.6,1)";
  div.style.transform = `scale(${scale})`;
  div.style.cursor = "pointer";
  div.onmouseenter = onHover;
  div.onmouseleave = onLeave;
  div.onclick = onClick;
  return div;
}

export function createClusterOverlay({
  centerLat,
  centerLng,
  hasRecommended,
  count,
  onClick,
}) {
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(
    <ClusterIcon recommended={hasRecommended} count={count} />
  );
  div.style.width = "44px";
  div.style.height = "44px";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.cursor = "pointer";
  div.onclick = onClick;
  return div;
}
