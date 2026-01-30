# Color Pasteboard

Color Pasteboard is a small single-page tool for extracting color codes from messy text. Paste anything that includes `#hex`, `rgb()`, or `rgba()` values and it will list clean swatches you can click to copy.

## Features
- Extracts hex (`#rgb`, `#rrggbb`, `#rrggbbaa`) and `rgb()/rgba()` values
- Merges duplicates automatically
- Click a swatch to copy the hex value
- Manual light/dark mode toggle with persistence

## Usage
- Open `index.html` in a browser.
- If you use modules locally, run a tiny server:
  - `python3 -m http.server 8000`
  - Open `http://localhost:8000`


## License
MIT. See `LICENSE`.
