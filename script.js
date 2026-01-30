import { extractColors } from "./js/colors.js";
import { createToast, renderSwatches } from "./js/ui.js";
import { initThemeToggle } from "./js/theme.js";

const input = document.querySelector("#input");
const swatches = document.querySelector("#swatches");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const themeToggle = document.querySelector("#theme-toggle");
const outputPanel = document.querySelector(".output");

const showToast = outputPanel ? createToast(outputPanel) : null;

function handleInput() {
  const colors = extractColors(input.value);
  renderSwatches({
    colors,
    swatchesEl: swatches,
    emptyEl: empty,
    countEl: count,
    onCopy: showToast,
  });
}

initThemeToggle(themeToggle);
input.addEventListener("input", handleInput);
handleInput();
