# FRIDA Scalable Modular Template Architecture

This folder provides the canonical blueprint and scaffold for building isolated, high-performance invitation templates for the FRIDA platform.

## Architecture Pattern:
Each template module is 100% self-contained in its own directory:
```text
template-name/
├── index.ts                # Clean exports (Template, OpeningScreen, CardImage, config)
├── Template.tsx            # Interactive live invitation layout orchestrator
├── OpeningScreen.tsx       # Luxury opening screen / 3D envelope / interactive intro
├── CardImage.tsx           # High-resolution stationery card graphic for WhatsApp/PDF
├── config.ts               # Metadata, supported features, default theme
├── styles.css              # Scoped CSS (.template-<name>)
├── README.md               # Documentation & creative concept
├── components/             # Sub-components (Hero, Countdown, ActionButton, etc.)
└── canvas/                 # (Optional) Canvas 2D / 3D living effects & particle systems
```

## How to Create a New Template (خطوات إضافة قالب جديد):
1. **Duplicate Folder**: Copy `_starter/` to `src/features/invitations/templates/<new-template-name>/`.
2. **Configure**: Update `config.ts` with template ID, Arabic/English name, tags, and capabilities.
3. **Design Live Layout**: Customize components in `components/` and layout in `Template.tsx`.
4. **Design Opening Screen**: Customize the opening sequence in `OpeningScreen.tsx`.
5. **Design Card Image**: Customize the stationery card graphic in `CardImage.tsx`.
6. **Register**: Add the lazy import in `src/features/invitations/registry/templateRegistry.ts` and add metadata in `src/data/templates.ts`.
7. **Done!**: Your template is automatically code-split, lazy-loaded on demand, isolated with its own Error Boundary, and equipped with live preview, opening animations, and WhatsApp/PDF card exports.

