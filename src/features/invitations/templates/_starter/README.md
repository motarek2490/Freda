# FRIDA Template Scaffold

This folder serves as a blueprint for adding new standalone invitation templates to the FRIDA Digital Couture platform.

## How to Create a New Template:
1. Duplicate `_starter/` into a new folder: `src/features/invitations/templates/my-template/`
2. Update `config.ts` with template metadata (unique `id`, `layoutType`, `defaultColors`, `supportedLanguages`).
3. Implement the visual layout in `Template.tsx` receiving standard `InvitationTemplateProps`.
4. Register the template in `src/features/invitations/registry/templateRegistry.ts`.
5. That's it! The template is automatically isolated, lazy-loaded, and protected by its own error boundary.
