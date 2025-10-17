import { renderToStaticMarkup } from "react-dom/server";
import MarkerIcon from "@/components/ui/MarkerIcon";
import ClusterIcon from "@/components/ui/ClusterIcon";
import SchoolMarker from "@/components/ui/SchoolMarkerIcon";

export function createMarkerOverlay({
  isHighlighted,
  onHover,
  onLeave,
  onClick,
}) {
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(
    <MarkerIcon recommended={isHighlighted} />
  );
  div.style.cssText = `
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform .17s cubic-bezier(.2,1,.2,1), background .17s;
    will-change: transform;
  `;
  div.onmouseenter = () => {
    div.style.transform = "scale(1.12)";
    if (onHover) onHover();
  };
  div.onmouseleave = () => {
    div.style.transform = "";
    if (onLeave) onLeave();
  };
  div.onmousedown = () => {
    div.style.transform = "scale(1.16)";
  };
  div.onmouseup = () => {
    div.style.transform = "scale(1.12)";
  };
  div.onclick = onClick;
  return div;
}

export function createSchoolOverlay() {
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(<SchoolMarker />);
  div.style.cssText = `
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `;
  return div;
}

export function createClusterOverlay({ hasRecommended, count, onClick }) {
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
