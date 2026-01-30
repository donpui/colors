function hexToRgba(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  let a = 1;
  if (clean.length === 8) {
    a = parseInt(clean.slice(6, 8), 16) / 255;
  }
  return { r, g, b, a };
}

function compositeOnWhite({ r, g, b, a }) {
  if (a >= 1) {
    return { r, g, b };
  }
  return {
    r: Math.round(r * a + 255 * (1 - a)),
    g: Math.round(g * a + 255 * (1 - a)),
    b: Math.round(b * a + 255 * (1 - a)),
  };
}

function srgbToLinear(channel) {
  const value = channel / 255;
  if (value <= 0.03928) {
    return value / 12.92;
  }
  return Math.pow((value + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }) {
  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function contrastRatio(colorA, colorB) {
  const lumA = relativeLuminance(colorA);
  const lumB = relativeLuminance(colorB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function ratingFromRatio(ratio) {
  if (ratio >= 7) {
    return { label: "AAA", className: "aaa" };
  }
  if (ratio >= 4.5) {
    return { label: "AA", className: "aa" };
  }
  if (ratio >= 3) {
    return { label: "AA Large", className: "aa-large" };
  }
  return { label: "Fail", className: "fail" };
}

function buildPairs(colors) {
  const pairs = [];
  for (let i = 0; i < colors.length; i += 1) {
    for (let j = i + 1; j < colors.length; j += 1) {
      const left = compositeOnWhite(hexToRgba(colors[i].hex));
      const right = compositeOnWhite(hexToRgba(colors[j].hex));
      const ratio = contrastRatio(left, right);
      pairs.push({
        a: colors[i],
        b: colors[j],
        ratio,
        rating: ratingFromRatio(ratio),
      });
    }
  }
  return pairs;
}

function createCard(pair, index) {
  const card = document.createElement("div");
  card.className = "contrast-card";
  card.style.animationDelay = `${index * 40}ms`;

  const samples = document.createElement("div");
  samples.className = "contrast-samples";

  const sampleA = document.createElement("div");
  sampleA.className = "sample";
  sampleA.style.setProperty("--sample", pair.a.css);
  sampleA.setAttribute("aria-label", pair.a.hex);

  const sampleB = document.createElement("div");
  sampleB.className = "sample";
  sampleB.style.setProperty("--sample", pair.b.css);
  sampleB.setAttribute("aria-label", pair.b.hex);

  samples.append(sampleA, sampleB);

  const meta = document.createElement("div");
  meta.className = "contrast-meta";

  const labels = document.createElement("div");
  labels.className = "contrast-pair";
  labels.textContent = `${pair.a.hex} / ${pair.b.hex}`;

  const ratioWrap = document.createElement("div");
  ratioWrap.className = "contrast-ratio";

  const ratioValue = document.createElement("span");
  ratioValue.className = "ratio-value";
  ratioValue.textContent = `${pair.ratio.toFixed(2)}:1`;

  const badge = document.createElement("span");
  badge.className = `badge ${pair.rating.className}`;
  badge.textContent = pair.rating.label;

  ratioWrap.append(ratioValue, badge);
  meta.append(labels, ratioWrap);
  card.append(samples, meta);

  return card;
}

export function renderContrast({ colors, containerEl, emptyEl, countEl }) {
  if (!containerEl || !emptyEl) {
    return;
  }

  containerEl.innerHTML = "";

  if (!colors || colors.length < 2) {
    emptyEl.style.display = "block";
    if (countEl) {
      countEl.textContent = "0 pairs";
    }
    return;
  }

  emptyEl.style.display = "none";

  const pairs = buildPairs(colors);
  pairs.forEach((pair, index) => {
    containerEl.appendChild(createCard(pair, index));
  });

  if (countEl) {
    const label = pairs.length === 1 ? "pair" : "pairs";
    countEl.textContent = `${pairs.length} ${label}`;
  }
}
