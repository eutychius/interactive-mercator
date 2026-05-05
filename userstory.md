# User Story

As a user exploring world map projections,
I want to drag an interactive Mercator map with my mouse,
so that I can recenter the projection on any region, such as Greenland, and immediately see how the map changes.

# Notes

- Use `globe.obj` as the source globe model for the solution.
- The interaction should change the projection center, not only pan a flat image.
- The map should behave like a Mercator projection re-rendered from a different central longitude and latitude.

# Recommended Stack

- Frontend: React + TypeScript + Vite
- Projection math: d3-geo
- Rendering: HTML Canvas 2D
- Globe asset loading: three.js with OBJLoader for `globe.obj`
- Input handling: native Pointer Events
- Testing: Vitest for projection logic and Playwright for drag interaction
- Runtime shape: browser-only app, no backend required

# Acceptance Criteria

1. The application loads and uses `globe.obj` as an input asset for the rendered map experience.
2. The application displays a Mercator projection in the browser or desktop UI, not only a 3D globe view.
3. The user can click and drag with the mouse to change the projection center interactively.
4. Horizontal dragging changes the central longitude of the Mercator projection in real time.
5. Vertical dragging changes the central latitude in real time, within safe Mercator limits that avoid pole singularities.
6. During dragging, the map redraws smoothly enough that the center shift feels immediate and continuous.
7. When the user drags until Greenland is near the middle of the viewport, the projection updates so Greenland becomes the visual center of the map.
8. Land shapes remain geographically consistent while the projection center changes; the interaction must not stretch, rotate, or move the flat map as a simple image pan.
9. The map wraps cleanly across the antimeridian so no permanent seam or missing region appears when the central longitude changes.
10. The solution prevents invalid projection output near the poles by clamping latitude or applying an equivalent safeguard.
11. The default starting state shows a valid Mercator world map before any user interaction.
12. The interaction works with a mouse on Windows.

# Done When

- A user can open the app, drag the map, and intentionally recenter the Mercator projection on Greenland or another target region.
- The implementation uses `globe.obj`.
- The behavior is demonstrable without manual file editing or developer-only controls.