# Photos

Drop images here, then list them in `photos` in `src/content/resume.ts`:

```ts
export const photos: Photo[] = [
  {
    src: "/photos/your-file.jpg",
    alt: "Vijay presenting the VendorHub design to the team at Acuver",
    caption: "Design walkthrough, Acuver Consulting",
  },
];
```

Guidance:
- **Landscape 4:3** crops best (the grid uses `aspect-[4/3]`).
- ~1200px wide is plenty; Next.js optimizes and serves responsive sizes.
- `alt` is required — describe what is happening, not "photo of me".
- Only use photos you actually have rights to. No stock, no generated images.

The Photos section and its nav link stay hidden while the array is empty.
