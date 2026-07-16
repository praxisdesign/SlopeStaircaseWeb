# SlopeStaircaseWeb

SlopeStaircaseWeb is a local browser-based configurator for designing slope stairs with live 3D feedback. The first version focuses on a practical design workflow: adjust stair dimensions, preview the generated stair geometry, validate basic constraints, and prepare placeholders for PDF export and quote requests.

## Features

- Live 3D stair preview powered by Three.js.
- Configurable width, length, height, step height, platform count, toe style, and dimension labels.
- Slider and numeric inputs for fast and precise editing.
- Basic validation warnings for early design feedback.
- Starter export panel for PDF and quote-request workflows.

## Getting Started

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Controls

- Drag the 3D preview to orbit around the staircase.
- Use the mouse wheel or trackpad to zoom.
- Change values in the Design tab to update the model.
- Use Reset to restore the default stair parameters.
