const COLOR_PATTERN = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(\s*[^)]+\)/gi;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function toHexPair(value) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}

function normalizeHex(raw) {
  const clean = raw.replace("#", "").toLowerCase();
  if (![3, 4, 6, 8].includes(clean.length)) {
    return null;
  }
  if (clean.length === 3 || clean.length === 4) {
    const expanded = clean
      .split("")
      .map((char) => char + char)
      .join("");
    return `#${expanded}`;
  }
  return `#${clean}`;
}

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

function formatAlpha(alpha) {
  const rounded = Math.round(alpha * 100) / 100;
  return rounded.toString();
}

function rgbaToStrings({ r, g, b, a }) {
  if (a < 1) {
    return {
      rgb: `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`,
      css: `rgba(${r}, ${g}, ${b}, ${a})`,
    };
  }
  return {
    rgb: `rgb(${r}, ${g}, ${b})`,
    css: `rgb(${r}, ${g}, ${b})`,
  };
}

function rgbaToHex({ r, g, b, a }) {
  const hex = `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
  if (a < 1) {
    return `${hex}${toHexPair(a * 255)}`;
  }
  return hex;
}

function parseRgb(raw) {
  const matches = [...raw.matchAll(/(-?\d*\.?\d+)%?/g)];
  if (matches.length < 3) {
    return null;
  }

  const values = matches.map((match) => ({
    value: Number(match[1]),
    hasPercent: match[0].includes("%"),
  }));

  const [rRaw, gRaw, bRaw] = values;
  const r = rRaw.hasPercent
    ? clamp(Math.round((rRaw.value / 100) * 255), 0, 255)
    : clamp(rRaw.value, 0, 255);
  const g = gRaw.hasPercent
    ? clamp(Math.round((gRaw.value / 100) * 255), 0, 255)
    : clamp(gRaw.value, 0, 255);
  const b = bRaw.hasPercent
    ? clamp(Math.round((bRaw.value / 100) * 255), 0, 255)
    : clamp(bRaw.value, 0, 255);

  let a = 1;
  if (values[3]) {
    if (values[3].hasPercent) {
      a = clamp(values[3].value / 100, 0, 1);
    } else {
      a = values[3].value > 1
        ? clamp(values[3].value / 255, 0, 1)
        : clamp(values[3].value, 0, 1);
    }
  }

  return { r, g, b, a };
}

function parseColor(match) {
  if (match.startsWith("#")) {
    const normalized = normalizeHex(match);
    if (!normalized) {
      return null;
    }
    const rgba = hexToRgba(normalized);
    const { rgb, css } = rgbaToStrings(rgba);
    return { key: normalized, hex: normalized, rgb, css };
  }

  if (match.toLowerCase().startsWith("rgb")) {
    const rgba = parseRgb(match);
    if (!rgba) {
      return null;
    }
    const hex = rgbaToHex(rgba);
    const { rgb, css } = rgbaToStrings(rgba);
    return { key: hex, hex, rgb, css };
  }

  return null;
}

export function extractColors(text) {
  const found = [];
  let match;
  while ((match = COLOR_PATTERN.exec(text)) !== null) {
    found.push(match[0]);
  }

  const seen = new Set();
  const results = [];

  found.forEach((value) => {
    const color = parseColor(value);
    if (!color || seen.has(color.key)) {
      return;
    }
    seen.add(color.key);
    results.push(color);
  });

  return results;
}
