function createToast(container) {
  const toast = document.createElement("div");
  toast.className = "toast";
  container.appendChild(toast);

  const show = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(show.timeout);
    show.timeout = setTimeout(() => toast.classList.remove("show"), 1200);
  };

  return show;
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const fallback = document.createElement("textarea");
  fallback.value = text;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "absolute";
  fallback.style.left = "-9999px";
  document.body.appendChild(fallback);
  fallback.select();
  document.execCommand("copy");
  document.body.removeChild(fallback);
  return Promise.resolve();
}

function renderSwatches({ colors, swatchesEl, emptyEl, countEl, onCopy }) {
  swatchesEl.innerHTML = "";
  if (!colors.length) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
  }

  colors.forEach((color, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "swatch";
    card.setAttribute("aria-label", `Copy ${color.hex}`);
    card.style.setProperty("--swatch", color.css);
    card.style.animationDelay = `${index * 50}ms`;

    const chip = document.createElement("div");
    chip.className = "chip";

    const meta = document.createElement("div");
    meta.className = "meta";

    const hex = document.createElement("div");
    hex.className = "hex";
    hex.textContent = color.hex;

    const rgb = document.createElement("div");
    rgb.className = "rgb";
    rgb.textContent = color.rgb;

    const order = document.createElement("div");
    order.className = "rgb";
    order.textContent = `#${index + 1}`;

    meta.append(hex, rgb, order);
    card.append(chip, meta);

    card.addEventListener("click", () => {
      copyToClipboard(color.hex).then(() => {
        if (onCopy) {
          onCopy(`Copied ${color.hex}`);
        }
      });
    });

    swatchesEl.appendChild(card);
  });

  countEl.textContent = `${colors.length} ${colors.length === 1 ? "color" : "colors"}`;
}

export { createToast, renderSwatches };
