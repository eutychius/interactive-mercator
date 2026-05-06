# Interactive Mercator

> Have you ever wondered what the Mercator projection would look like if it were centered on Australia instead of Europe?

This small React + TypeScript demo lets you drag a Mercator world map and recenter the projection in real time, so the map is re-rendered around a new longitude and latitude instead of panning a flat image.

![Interactive Mercator demo](./Interactive%20Mercator.gif)

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL in a browser, then drag on the map canvas.

## Stack

- React 18
- TypeScript
- Vite
- d3-geo
- three.js
- Vitest