# FRIDA Scalable Modular Template Architecture

This folder provides the canonical blueprint and scaffold for building isolated, high-performance invitation templates for the FRIDA platform.

## Architecture Pattern:
Each template module is 100% self-contained:
```text
template-name/
├── index.ts                # Clean exports (Template, config)
├── Template.tsx            # Main layout orchestrator
├── config.ts               # Metadata, supported features, default theme
├── styles.css              # Scoped CSS (.template-<name>)
├── README.md               # Documentation & creative concept
├── components/             # Sub-components (Hero, Countdown, ActionButton, etc.)
└── canvas/                 # (Optional) Canvas 2D / 3D living effects & particle systems
```

## How to Create a New Template:
1. Duplicate `_starter/` to `src/features/invitations/templates/<new-template-name>/`.
2. Update `config.ts` with template ID, Arabic/English name, and capabilities.
3. Customize components in `components/` and layout in `Template.tsx`.
4. Register the template in `src/features/invitations/registry/templateRegistry.ts`.
5. That's it! Your template is automatically lazy-loaded, protected by its own Error Boundary, and isolated from other templates.
