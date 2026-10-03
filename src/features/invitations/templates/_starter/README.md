# FRIDA — Sunlit Garden

A light, joyful, editorial wedding template: ivory paper, sunlight, silk ribbons, botanical illustration. Not dark, not gothic, not a pastel website.

## Structure
- `Template.tsx`: live layout (01 Beginning, 02 Celebration, 03 The Day, 04 Memories, 05 Guestbook, 06 Gifts, then RSVP)
- `OpeningScreen.tsx`: ivory sunrise intro with a single open button
- `CardImage.tsx`: static stationery card for WhatsApp/PDF (inline styles, no canvas)
- `canvas/`: `SunlitCanvas.tsx` (rAF loop, DPR, visibility pause) + `sunlight.ts`, `flowers.ts`, `ribbons.ts`, `petals.ts`
- `components/`: Hero, EditorialDetails, Countdown, Gallery, Guestbook, GiftRegistry, RSVP
- `config.ts`, `styles.css` (scoped under `.template-sunlit-garden`)

## Palette
Ivory #FFF9F0, Butter #F6D98B, Peach #F4B7A3, Blush #E9A6A6, Pistachio #C8D7B2, Powder #B9D6E8, Lavender #CFC2DF, Champagne #D8BC8A.

## Registering
Add the lazy import to `registry/templateRegistry.ts` and the metadata to `src/data/templates.ts`.

## Verify against your model
- Gallery image field (`Template.tsx`)
- Gift registry flag (`Template.tsx`)
- Wish object fields (`Guestbook.tsx`: `message`, `author`, `relation`)
- `layoutType` / `introType` values (`config.ts`)
- Animation import (`motion/react` vs `framer-motion`)

No Firebase or backend code is touched.
