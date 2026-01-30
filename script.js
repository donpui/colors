import { extractColors } from "./js/colors.js";
import { createToast, renderSwatches } from "./js/ui.js";
import { initThemeToggle } from "./js/theme.js";
import { renderContrast } from "./js/contrast.js";

const input = document.querySelector("#input");
const swatches = document.querySelector("#swatches");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const themeToggle = document.querySelector("#theme-toggle");
const outputPanel = document.querySelector(".output");
const contrastContainer = document.querySelector("#contrast");
const contrastEmpty = document.querySelector("#contrast-empty");
const contrastCount = document.querySelector("#contrast-count");

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
  renderContrast({
    colors,
    containerEl: contrastContainer,
    emptyEl: contrastEmpty,
    countEl: contrastCount,
  });
}

initThemeToggle(themeToggle);
input.addEventListener("input", handleInput);
handleInput();
